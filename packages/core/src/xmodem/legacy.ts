import { byteStuffing, byteUnstuffing, intToUintByte } from '../bytes';
import { constants, radix } from '../config';
import { hexToUint8Array, padStart, uint8ArrayToHex } from '../utils';
import { crc16 } from '../utils/crc';
import { PacketVersion, PacketVersionMap } from '../utils/versions';

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
  version: PacketVersion
) => {
  let usableConstants = constants.v1;
  let usableRadix = radix.v1;

  if (version === PacketVersionMap.v2) {
    usableConstants = constants.v2;
    usableRadix = radix.v2;
  }

  const { CHUNK_SIZE, START_OF_FRAME } = usableConstants;

  const rounds = Math.ceil(data.length / CHUNK_SIZE);
  const packetList: string[] = [];
  for (let i = 1; i <= rounds; i += 1) {
    const currentPacketNumber = intToUintByte(
      i,
      usableRadix.currentPacketNumber
    );
    const totalPacket = intToUintByte(rounds, usableRadix.totalPacket);
    const dataChunk = data.slice(
      (i - 1) * CHUNK_SIZE,
      (i - 1) * CHUNK_SIZE + CHUNK_SIZE
    );
    const commData = currentPacketNumber + totalPacket + dataChunk;
    const crc = intToUintByte(crc16(hexToUint8Array(commData)), 16);
    const stuffedData = byteStuffing(hexToUint8Array(commData + crc), version);
    const commHeader =
      START_OF_FRAME +
      intToUintByte(commandType, usableRadix.commandType) +
      intToUintByte(stuffedData.length / 2, usableRadix.dataSize);
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
 * @param param - Data in buffer object
 * @return list of decoded packets
 */
export const xmodemDecode = (
  param: Uint8Array,
  version: PacketVersion
): LegacyDecodedPacketData[] => {
  let usableConstants = constants.v1;
  let usableRadix = radix.v1;

  if (version === PacketVersionMap.v2) {
    usableConstants = constants.v2;
    usableRadix = radix.v2;
  }

  const { CHUNK_SIZE, START_OF_FRAME } = usableConstants;

  let data = uint8ArrayToHex(param).toUpperCase();

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
      `0x${data.slice(offset, offset + usableRadix.commandType / 4)}`,
      16
    );
    offset += usableRadix.commandType / 4;
    const dataSize = parseInt(
      data.slice(offset, offset + usableRadix.dataSize / 4),
      16
    );
    offset += usableRadix.dataSize / 4;
    const stuffedData = data.slice(offset, offset + dataSize * 2);
    data = data.slice(offset + dataSize * 2);
    const unStuffedData = byteUnstuffing(hexToUint8Array(stuffedData), version);
    offset = 0;
    const currentPacketNumber = unStuffedData.slice(
      offset,
      offset + usableRadix.currentPacketNumber / 4
    );
    offset += usableRadix.currentPacketNumber / 4;
    const totalPacket = unStuffedData.slice(
      offset,
      offset + usableRadix.totalPacket / 4
    );
    offset += usableRadix.totalPacket / 4;
    const dataChunk = unStuffedData.slice(
      offset,
      offset + unStuffedData.length - 6 * 2
    );
    offset += unStuffedData.length - 6 * 2;
    const crc = unStuffedData.slice(offset, offset + usableRadix.crc / 4);
    const crcInput = unStuffedData.slice(
      0,
      unStuffedData.length - usableRadix.crc / 4
    );
    const actualCRC = padStart(
      crc16(hexToUint8Array(crcInput)).toString(16),
      4,
      '0'
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
      errorList
    });
  }
  return packetList;
};

export const createAckPacket = (
  commandType: number,
  packetNumber: string,
  version: PacketVersion
) => {
  let usableConstants = constants.v1;
  let usableRadix = radix.v1;

  if (version === PacketVersionMap.v2) {
    usableConstants = constants.v2;
    usableRadix = radix.v2;
  }

  const { START_OF_FRAME } = usableConstants;

  const currentPacketNumber = intToUintByte(
    packetNumber,
    usableRadix.currentPacketNumber
  );

  const totalPacket = intToUintByte(0, usableRadix.totalPacket);
  const dataChunk = '00000000';
  const commData = currentPacketNumber + totalPacket + dataChunk;
  const crc = padStart(crc16(hexToUint8Array(commData)).toString(16), 4, '0');
  const temp = commData + crc;
  const stuffedData = byteStuffing(hexToUint8Array(temp), version);

  const commHeader =
    START_OF_FRAME +
    intToUintByte(commandType, usableRadix.commandType) +
    intToUintByte(stuffedData.length / 2, usableRadix.dataSize);

  return commHeader + stuffedData;
};
