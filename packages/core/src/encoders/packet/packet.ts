import * as config from '../../config';
import {
  crc16,
  hexToUint8Array,
  PacketVersion,
  PacketVersionMap,
  uint8ArrayToHex,
  intToUintByte
} from '../../utils';

export interface DecodedPacketData {
  startOfFrame: string;
  currentPacketNumber: number;
  totalPacketNumber: number;
  payloadData: string;
  crc: string;
  sequenceNumber: number;
  packetType: number;
  errorList: string[];
  timestamp: number;
}

export enum ErrorPacketRejectReason {
  NO_ERROR = 0,
  CHECKSUM_ERROR = 1,
  BUSY_PREVIOUS_CMD = 2,
  OUT_OF_ORDER_CHUNK = 3,
  INVALID_CHUNK_COUNT = 4,
  INVALID_SEQUENCE_NO = 5,
  INVALID_PAYLOAD_LENGTH = 6,
  APP_BUFFER_BLOCKED = 7,
  NO_MORE_CHUNKS = 8,
  INVALID_PACKET_TYPE = 9,
  INVALID_CHUNK_NO = 10,
  INCOMPLETE_PACKET = 11
}

export const RejectReasonToMsgMap: Record<
  ErrorPacketRejectReason,
  string | undefined
> = {
  [ErrorPacketRejectReason.NO_ERROR]: 'No error',
  [ErrorPacketRejectReason.CHECKSUM_ERROR]: 'Checksum error',
  [ErrorPacketRejectReason.BUSY_PREVIOUS_CMD]:
    'Device is busy on previous command',
  [ErrorPacketRejectReason.OUT_OF_ORDER_CHUNK]: 'Chunk out of order',
  [ErrorPacketRejectReason.INVALID_CHUNK_COUNT]: 'Invalid chunk count',
  [ErrorPacketRejectReason.INVALID_SEQUENCE_NO]: 'Invalid sequence number',
  [ErrorPacketRejectReason.INVALID_PAYLOAD_LENGTH]: 'Invalid payload length',
  [ErrorPacketRejectReason.APP_BUFFER_BLOCKED]: 'Application buffer blocked',
  [ErrorPacketRejectReason.NO_MORE_CHUNKS]: 'No more chunks',
  [ErrorPacketRejectReason.INVALID_PACKET_TYPE]: 'Invalid packet type',
  [ErrorPacketRejectReason.INVALID_CHUNK_NO]: 'Invalid chunk number',
  [ErrorPacketRejectReason.INCOMPLETE_PACKET]: 'Incomplete packet'
};

export const encodePayloadData = (
  rawData: string,
  protobufData: string,
  version: PacketVersion
) => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  if (rawData.length === 0 && protobufData.length === 0) return '';

  const usableConfig = config.v3;

  const serializedRawDataLength = intToUintByte(
    rawData.length / 2,
    usableConfig.radix.dataSize
  );
  const serializedProtobufDataLength = intToUintByte(
    protobufData.length / 2,
    usableConfig.radix.dataSize
  );

  return (
    serializedProtobufDataLength +
    serializedRawDataLength +
    protobufData +
    rawData
  );
};

export const encodePacket = ({
  data,
  version,
  sequenceNumber,
  packetType,
  isProto
}: {
  data: string;
  version: PacketVersion;
  sequenceNumber: number;
  packetType: number;
  isProto: boolean;
}) => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  const serializedSequenceNumber = intToUintByte(
    sequenceNumber,
    usableConfig.radix.sequenceNumber
  );
  const serializedPacketType = intToUintByte(
    packetType,
    usableConfig.radix.packetType
  );

  const { CHUNK_SIZE, START_OF_FRAME } = usableConfig.constants;

  let serializedData: string;
  if (isProto) {
    serializedData = encodePayloadData('', data, version);
  } else {
    serializedData = encodePayloadData(data, '', version);
  }

  let rounds = Math.ceil(serializedData.length / CHUNK_SIZE);

  const hasNoData = serializedData.length === 0;

  if (hasNoData) {
    rounds = 1;
  }

  const packetList: string[] = [];

  for (let i = 1; i <= rounds; i += 1) {
    const currentPacketNumber = intToUintByte(
      i,
      usableConfig.radix.currentPacketNumber
    );
    const totalPacketNumber = intToUintByte(
      rounds,
      usableConfig.radix.totalPacket
    );
    const dataChunk = serializedData.slice(
      (i - 1) * CHUNK_SIZE,
      (i - 1) * CHUNK_SIZE + CHUNK_SIZE
    );

    const payload = dataChunk;
    const payloadLength = intToUintByte(
      dataChunk.length / 2,
      usableConfig.radix.payloadLength
    );

    const serializedTimestamp = intToUintByte(
      new Date()
        .getTime()
        .toString()
        .slice(0, usableConfig.radix.timestampLength / 4),
      usableConfig.radix.timestampLength
    );

    const commData =
      currentPacketNumber +
      totalPacketNumber +
      serializedSequenceNumber +
      serializedPacketType +
      serializedTimestamp +
      payloadLength +
      payload;
    const crc = intToUintByte(
      crc16(Buffer.from(commData, 'hex')),
      usableConfig.radix.crc
    );
    const packet = START_OF_FRAME + crc + commData;

    packetList.push(packet);
  }
  return packetList.map(elem => hexToUint8Array(elem));
};

export const decodePacket = (
  param: Uint8Array,
  version: PacketVersion
): DecodedPacketData[] => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  const { START_OF_FRAME } = usableConfig.constants;

  let data = uint8ArrayToHex(param).toUpperCase();
  const packetList: DecodedPacketData[] = [];
  let offset = data.indexOf(START_OF_FRAME);

  while (data.length > 0) {
    offset = data.indexOf(START_OF_FRAME);

    // Invalid data if no START_OF_FRAME
    if (offset === -1) {
      return packetList;
    }

    const startOfFrame = data.slice(offset, offset + START_OF_FRAME.length);
    offset += START_OF_FRAME.length;

    const crc = data.slice(offset, offset + usableConfig.radix.crc / 4);
    offset += usableConfig.radix.crc / 4;

    const currentPacketNumber = parseInt(
      `0x${data.slice(
        offset,
        offset + usableConfig.radix.currentPacketNumber / 4
      )}`,
      16
    );
    offset += usableConfig.radix.currentPacketNumber / 4;

    const totalPacketNumber = parseInt(
      `0x${data.slice(offset, offset + usableConfig.radix.totalPacket / 4)}`,
      16
    );
    offset += usableConfig.radix.totalPacket / 4;

    const sequenceNumber = parseInt(
      `0x${data.slice(offset, offset + usableConfig.radix.sequenceNumber / 4)}`,
      16
    );
    offset += usableConfig.radix.sequenceNumber / 4;

    const packetType = parseInt(
      `0x${data.slice(offset, offset + usableConfig.radix.packetType / 4)}`,
      16
    );
    offset += usableConfig.radix.packetType / 4;

    const timestamp = parseInt(
      `0x${data.slice(
        offset,
        offset + usableConfig.radix.timestampLength / 4
      )}`,
      16
    );
    offset += usableConfig.radix.timestampLength / 4;

    const payloadLength = parseInt(
      `0x${data.slice(offset, offset + usableConfig.radix.payloadLength / 4)}`,
      16
    );
    offset += usableConfig.radix.payloadLength / 4;

    let payloadData = '';
    if (payloadLength !== 0) {
      payloadData = data.slice(offset, offset + payloadLength * 2);
      offset += payloadLength * 2;
    }

    data = data.slice(offset);

    const commData =
      intToUintByte(
        currentPacketNumber,
        usableConfig.radix.currentPacketNumber
      ) +
      intToUintByte(totalPacketNumber, usableConfig.radix.totalPacket) +
      intToUintByte(sequenceNumber, usableConfig.radix.sequenceNumber) +
      intToUintByte(packetType, usableConfig.radix.packetType) +
      intToUintByte(timestamp, usableConfig.radix.timestampLength) +
      intToUintByte(payloadLength, usableConfig.radix.payloadLength) +
      payloadData;
    const actualCRC = intToUintByte(
      crc16(Buffer.from(commData, 'hex')),
      usableConfig.radix.crc
    );

    const errorList = [];
    if (startOfFrame.toUpperCase() !== START_OF_FRAME) {
      errorList.push('Invalid Start of frame');
    }
    if (currentPacketNumber > totalPacketNumber) {
      errorList.push('currentPacketNumber is greater than totalPacketNumber');
    }
    if (actualCRC.toUpperCase() !== crc.toUpperCase()) {
      errorList.push('invalid crc');
    }
    packetList.push({
      startOfFrame,
      currentPacketNumber,
      totalPacketNumber,
      crc,
      payloadData,
      errorList,
      sequenceNumber,
      packetType,
      timestamp
    });
  }
  return packetList;
};

export const decodePayloadData = (payload: string, version: PacketVersion) => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  let payloadOffset = 0;

  const protobufDataSize = parseInt(
    `0x${payload.slice(
      payloadOffset,
      payloadOffset + usableConfig.radix.dataSize / 4
    )}`,
    16
  );
  payloadOffset += usableConfig.radix.dataSize / 4;

  const rawDataSize = parseInt(
    `0x${payload.slice(
      payloadOffset,
      payloadOffset + usableConfig.radix.dataSize / 4
    )}`,
    16
  );
  payloadOffset += usableConfig.radix.dataSize / 4;

  const protobufData = payload.slice(
    payloadOffset,
    payloadOffset + protobufDataSize * 2
  );
  payloadOffset += protobufDataSize * 2;

  const rawData = payload.slice(payloadOffset, payloadOffset + rawDataSize * 2);
  payloadOffset += rawDataSize * 2;

  return {
    protobufData,
    rawData
  };
};
