import {
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import {
  assert,
  crc16,
  hexToUint8Array,
  intToUintByte,
  isHex,
  padStart,
  uint8ArrayToHex,
} from '@cypherock/sdk-utils';

import * as config from '../../config';
import {
  byteStuffing,
  byteUnstuffing,
  PacketVersion,
  PacketVersionMap,
} from '../../utils';

export interface LegacyDecodedPacketData {
  startOfFrame: string;
  commandType: number;
  currentPacketNumber: number;
  totalPacket: number;
  dataSize: number;
  dataChunk: string;
  crc: string;
  errorList: string[];
}

/**
 * Encodes the data and command number, and returns a list of packets.
 *
 *
 * @param data - Data in hex format
 * @param commandType - The command number to be sent
 * @return list of packets (or list of strings)
 */
export const xmodemEncode = (
  data: string,
  commandType: number,
  version: PacketVersion,
) => {
  assert(data, 'Invalid data');
  assert(data.length > 0, 'data cannot be empty');
  assert(commandType, 'Invalid commandType');
  assert(version, 'Invalid version');

  assert(isHex(data), 'Invalid hex data');
  assert(commandType >= 0, 'Command type should not be negative');

  if (![PacketVersionMap.v1, PacketVersionMap.v2].includes(version)) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

  const { CHUNK_SIZE, START_OF_FRAME } = usableConfig.constants;

  const rounds = Math.ceil(data.length / CHUNK_SIZE);
  const packetList: string[] = [];
  for (let i = 1; i <= rounds; i += 1) {
    const currentPacketNumber = intToUintByte(
      i,
      usableConfig.radix.currentPacketNumber,
    );
    const totalPacket = intToUintByte(rounds, usableConfig.radix.totalPacket);
    const dataChunk = data.slice(
      (i - 1) * CHUNK_SIZE,
      (i - 1) * CHUNK_SIZE + CHUNK_SIZE,
    );
    const commData = currentPacketNumber + totalPacket + dataChunk;
    const crc = intToUintByte(crc16(hexToUint8Array(commData)), 16);
    const stuffedData = byteStuffing(hexToUint8Array(commData + crc), version);
    const commHeader =
      START_OF_FRAME +
      intToUintByte(commandType, usableConfig.radix.commandType) +
      intToUintByte(stuffedData.length / 2, usableConfig.radix.dataSize);
    const packet = commHeader + stuffedData;
    packetList.push(packet);
  }

  return packetList.map(hexToUint8Array);
};

/**
 * Decodes the data from a Buffer object into a packetList with the format
 *   {
 *    startOfFrame,
 *     commandType,
 *     currentPacketNumber,
 *     totalPacket,
 *     dataSize,
 *     dataChunk,
 *     crc,
 *     errorList
 *   }
 *
 *
 * @packetData packetData - Data in buffer object
 * @return list of decoded packets
 */
export const xmodemDecode = (
  packetData: Uint8Array,
  version: PacketVersion,
): LegacyDecodedPacketData[] => {
  assert(packetData, 'Invalid packetData');
  assert(version, 'Invalid version');

  if (![PacketVersionMap.v1, PacketVersionMap.v2].includes(version)) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

  const { CHUNK_SIZE, START_OF_FRAME } = usableConfig.constants;

  let data = uint8ArrayToHex(packetData).toUpperCase();

  const packetList: LegacyDecodedPacketData[] = [];
  let offset = data.indexOf(START_OF_FRAME);

  while (data.length > 0) {
    offset = data.indexOf(START_OF_FRAME);

    // Invalid data if no START_OF_FRAME
    if (offset === -1) {
      return packetList;
    }

    const startOfFrame = data.slice(offset, offset + START_OF_FRAME.length);
    offset += START_OF_FRAME.length;
    const commandType = parseInt(
      `0x${data.slice(offset, offset + usableConfig.radix.commandType / 4)}`,
      16,
    );
    offset += usableConfig.radix.commandType / 4;
    const dataSize = parseInt(
      data.slice(offset, offset + usableConfig.radix.dataSize / 4),
      16,
    );
    offset += usableConfig.radix.dataSize / 4;
    const stuffedData = data.slice(offset, offset + dataSize * 2);
    data = data.slice(offset + dataSize * 2);
    const unStuffedData = byteUnstuffing(hexToUint8Array(stuffedData), version);
    offset = 0;
    const currentPacketNumber = unStuffedData.slice(
      offset,
      offset + usableConfig.radix.currentPacketNumber / 4,
    );
    offset += usableConfig.radix.currentPacketNumber / 4;
    const totalPacket = unStuffedData.slice(
      offset,
      offset + usableConfig.radix.totalPacket / 4,
    );
    offset += usableConfig.radix.totalPacket / 4;
    const dataChunk = unStuffedData.slice(
      offset,
      offset + unStuffedData.length - 6 * 2,
    );
    offset += unStuffedData.length - 6 * 2;
    const crc = unStuffedData.slice(
      offset,
      offset + usableConfig.radix.crc / 4,
    );
    const crcInput = unStuffedData.slice(
      0,
      unStuffedData.length - usableConfig.radix.crc / 4,
    );
    const actualCRC = padStart(
      crc16(hexToUint8Array(crcInput)).toString(16),
      4,
      '0',
    );

    const errorList = [];
    if (startOfFrame.toUpperCase() !== START_OF_FRAME) {
      errorList.push('Invalid Start of frame');
    }
    if (currentPacketNumber > totalPacket) {
      errorList.push('currentPacketNumber is greater than totalPacketNumber');
    }
    if (dataSize > CHUNK_SIZE) {
      // chunk size is already 2 times, and data size in worst case(all bytes stuffed) should be less than 2 time the actual chunk size
      errorList.push('invalid data size');
    }
    if (actualCRC !== crc) {
      errorList.push('invalid crc');
    }
    packetList.push({
      startOfFrame,
      commandType,
      currentPacketNumber: Number(`0x${currentPacketNumber}`),
      totalPacket: Number(`0x${totalPacket}`),
      dataSize,
      dataChunk,
      crc,
      errorList,
    });
  }
  return packetList;
};

export const createAckPacket = (
  commandType: number,
  packetNumber: string,
  version: PacketVersion,
) => {
  assert(commandType, 'Invalid commandType');
  assert(packetNumber, 'Invalid packetNumber');
  assert(version, 'Invalid version');

  assert(commandType >= 0, 'Command type cannot be negative');

  if (![PacketVersionMap.v1, PacketVersionMap.v2].includes(version)) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

  const { START_OF_FRAME } = usableConfig.constants;

  const currentPacketNumber = intToUintByte(
    packetNumber,
    usableConfig.radix.currentPacketNumber,
  );

  const totalPacket = intToUintByte(0, usableConfig.radix.totalPacket);
  const dataChunk = '00000000';
  const commData = currentPacketNumber + totalPacket + dataChunk;
  const crc = padStart(crc16(hexToUint8Array(commData)).toString(16), 4, '0');
  const temp = commData + crc;
  const stuffedData = byteStuffing(hexToUint8Array(temp), version);

  const commHeader =
    START_OF_FRAME +
    intToUintByte(commandType, usableConfig.radix.commandType) +
    intToUintByte(stuffedData.length / 2, usableConfig.radix.dataSize);

  return (commHeader + stuffedData).toLowerCase();
};
