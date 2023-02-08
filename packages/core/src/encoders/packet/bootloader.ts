import {
  byteUnstuffing,
  intToUintByte,
  crc16,
  PacketVersionMap,
  uint8ArrayToHex,
  hexToUint8Array
} from '../../utils';
import { v1 as config } from '../../config';

const START_OF_FRAME = '01';
const END_OF_TRANSMISSION = '04';
const CHUNK_SIZE = 256;
const { radix } = config;

export const stmXmodemEncode = (data: string) => {
  const rounds = Math.ceil(data.length / CHUNK_SIZE);
  const packetList: string[] = [];
  for (let i = 1; i <= rounds; i += 1) {
    const currentPacketNumber = intToUintByte(i % 255, 8);
    const packetNumberXor = intToUintByte(i % 255 ^ 255, 8);
    const dataChunkSlice = data.slice(
      (i - 1) * CHUNK_SIZE,
      (i - 1) * CHUNK_SIZE + CHUNK_SIZE
    );
    let dataChunk = dataChunkSlice;

    if (dataChunkSlice.length < CHUNK_SIZE) {
      for (let j = 0; j < CHUNK_SIZE - dataChunkSlice.length; j += 1) {
        dataChunk += 'f';
      }
    }

    const commData =
      START_OF_FRAME + currentPacketNumber + packetNumberXor + dataChunk;
    const crc = intToUintByte(crc16(Buffer.from(dataChunk, 'hex')), 16);
    const packet = commData + crc;
    packetList.push(packet);
  }
  packetList.push(END_OF_TRANSMISSION);
  return packetList;
};

export const stmXmodemDecode = (param: Uint8Array) => {
  let data = uint8ArrayToHex(param).toUpperCase();
  const packetList: any[] = [];
  let offset = data.indexOf(START_OF_FRAME);

  while (data.length > 0) {
    offset = data.indexOf(START_OF_FRAME);
    const startOfFrame = data.slice(offset, offset + 2);
    offset += 2;
    const commandType = parseInt(
      `0x${data.slice(offset, offset + radix.commandType / 4)}`,
      16
    );
    offset += radix.commandType / 4;
    const dataSize = parseInt(
      data.slice(offset, offset + radix.dataSize / 4),
      16
    );
    offset += radix.dataSize / 4;
    const stuffedData = data.slice(offset, offset + dataSize * 2);
    data = data.slice(offset + dataSize * 2);
    const unStuffedData = byteUnstuffing(
      hexToUint8Array(stuffedData),
      PacketVersionMap.v1
    );
    offset = 0;
    const currentPacketNumber = unStuffedData.slice(
      offset,
      offset + radix.currentPacketNumber / 4
    );
    offset += radix.currentPacketNumber / 4;
    const totalPacket = unStuffedData.slice(
      offset,
      offset + radix.totalPacket / 4
    );
    offset += radix.totalPacket / 4;
    const dataChunk = unStuffedData.slice(
      offset,
      offset + unStuffedData.length - 6 * 2
    );
    offset += unStuffedData.length - 6 * 2;
    const crc = unStuffedData.slice(offset, offset + radix.crc / 4);
    const crcInput = unStuffedData.slice(
      0,
      unStuffedData.length - radix.crc / 4
    );
    const actualCRC = crc16(Buffer.from(crcInput, 'hex'))
      .toString(16)
      .padStart(4, '0');

    let errorList = '';
    if (startOfFrame.toUpperCase() !== 'AA') errorList.concat();
    errorList += ' Invalid Start of frame ';
    if (currentPacketNumber > totalPacket)
      errorList += ' currentPacketNumber is greater than totalPacketNumber ';
    if (dataSize > CHUNK_SIZE)
      // chunk size is already 2 times, and data size in worst case(all bytes stuffed) should be less than 2 time the actual chunk size
      errorList += ' invalid data size ';
    if (actualCRC !== crc) errorList += ' invalid crc ';
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
