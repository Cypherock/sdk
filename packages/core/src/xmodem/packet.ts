import { intToUintByte } from '../bytes';
import { constants, radix } from '../config';
import { crc16 } from '../utils/crc';
import { PacketVersion, PacketVersionMap } from '../utils/versions';

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

export enum CmdState {
  CMD_STATE_NONE = 0,
  CMD_STATE_RECEIVING = 1,
  CMD_STATE_RECEIVED = 2,
  CMD_STATE_EXECUTING = 3,
  CMD_STATE_DONE = 4,
  CMD_STATE_FAILED = 5,
  CMD_STATE_INVALID_CMD = 6
}

export enum DeviceWaitOn {
  IDLE = 1,
  BUSY_IP_CARD = 2,
  BUSY_IP_KEY = 3
}

export enum DeviceIdleState {
  IDLE = 1,
  USB = 2,
  DEVICE = 3
}

export interface StatusData {
  deviceState: string;
  deviceWaitingOn: DeviceWaitOn;
  deviceIdleState: DeviceIdleState;
  abortDisabled: boolean;
  currentCmdSeq: number;
  cmdState: CmdState;
  flowStatus: number;
  isStatus?: boolean;
  isRawData?: boolean;
}

export interface RawData {
  commandType: number;
  data: string;
  isStatus?: boolean;
  isRawData?: boolean;
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

  const usableRadix = radix.v3;

  const serializedRawDataLength = intToUintByte(
    rawData.length / 2,
    usableRadix.dataSize
  );
  const serializedProtobufDataLength = intToUintByte(
    protobufData.length / 2,
    usableRadix.dataSize
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
  packetType
}: {
  data: string;
  version: PacketVersion;
  sequenceNumber: number;
  packetType: number;
}) => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConstants = constants.v3;
  const usableRadix = radix.v3;

  const serializedSequenceNumber = intToUintByte(
    sequenceNumber,
    usableRadix.sequenceNumber
  );
  const serializedPacketType = intToUintByte(
    packetType,
    usableRadix.packetType
  );

  const { CHUNK_SIZE, START_OF_FRAME } = usableConstants;

  const serializedData = encodePayloadData(data, '', version);

  let rounds = Math.ceil(serializedData.length / CHUNK_SIZE);

  const hasNoData = serializedData.length === 0;

  if (hasNoData) {
    rounds = 1;
  }

  const packetList: string[] = [];

  for (let i = 1; i <= rounds; i += 1) {
    const currentPacketNumber = intToUintByte(
      i,
      usableRadix.currentPacketNumber
    );
    const totalPacketNumber = intToUintByte(rounds, usableRadix.totalPacket);
    const dataChunk = serializedData.slice(
      (i - 1) * CHUNK_SIZE,
      (i - 1) * CHUNK_SIZE + CHUNK_SIZE
    );

    const payload = dataChunk;
    const payloadLength = intToUintByte(
      dataChunk.length / 2,
      usableRadix.payloadLength
    );

    const serializedTimestamp = intToUintByte(
      new Date()
        .getTime()
        .toString()
        .slice(0, usableRadix.timestampLength / 4),
      usableRadix.timestampLength
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
      usableRadix.crc
    );
    const packet = START_OF_FRAME + crc + commData;

    packetList.push(packet);
  }
  return packetList;
};

export const decodePacket = (
  param: Buffer,
  version: PacketVersion
): DecodedPacketData[] => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConstants = constants.v3;
  const usableRadix = radix.v3;

  const { START_OF_FRAME } = usableConstants;

  let data = param.toString('hex').toUpperCase();
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

    const crc = data.slice(offset, offset + usableRadix.crc / 4);
    offset += usableRadix.crc / 4;

    const currentPacketNumber = parseInt(
      `0x${data.slice(offset, offset + usableRadix.currentPacketNumber / 4)}`,
      16
    );
    offset += usableRadix.currentPacketNumber / 4;

    const totalPacketNumber = parseInt(
      `0x${data.slice(offset, offset + usableRadix.totalPacket / 4)}`,
      16
    );
    offset += usableRadix.totalPacket / 4;

    const sequenceNumber = parseInt(
      `0x${data.slice(offset, offset + usableRadix.sequenceNumber / 4)}`,
      16
    );
    offset += usableRadix.sequenceNumber / 4;

    const packetType = parseInt(
      `0x${data.slice(offset, offset + usableRadix.packetType / 4)}`,
      16
    );
    offset += usableRadix.packetType / 4;

    const timestamp = parseInt(
      `0x${data.slice(offset, offset + usableRadix.timestampLength / 4)}`,
      16
    );
    offset += usableRadix.timestampLength / 4;

    const payloadLength = parseInt(
      `0x${data.slice(offset, offset + usableRadix.payloadLength / 4)}`,
      16
    );
    offset += usableRadix.payloadLength / 4;

    let payloadData = '';
    if (payloadLength !== 0) {
      payloadData = data.slice(offset, offset + payloadLength * 2);
      offset += payloadLength * 2;
    }

    data = data.slice(offset);

    const commData =
      intToUintByte(currentPacketNumber, usableRadix.currentPacketNumber) +
      intToUintByte(totalPacketNumber, usableRadix.totalPacket) +
      intToUintByte(sequenceNumber, usableRadix.sequenceNumber) +
      intToUintByte(packetType, usableRadix.packetType) +
      intToUintByte(timestamp, usableRadix.timestampLength) +
      intToUintByte(payloadLength, usableRadix.payloadLength) +
      payloadData;
    const actualCRC = intToUintByte(
      crc16(Buffer.from(commData, 'hex')),
      usableRadix.crc
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

export const decodeStatus = (
  data: string,
  version: PacketVersion
): StatusData => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableRadix = radix.v3;

  let offset = 0;

  const deviceState = parseInt(
    `0x${data.slice(offset, offset + usableRadix.status.deviceState / 4)}`,
    16
  );
  offset += usableRadix.status.deviceState / 4;

  // eslint-disable-next-line no-bitwise
  const num = deviceState & 0xff;
  // eslint-disable-next-line no-bitwise
  const deviceIdleState = num & 0xf;
  // eslint-disable-next-line no-bitwise
  const deviceWaitingOn = num >> 4;

  const abortDisabled =
    parseInt(
      `0x${data.slice(offset, offset + usableRadix.status.abortDisabled / 4)}`,
      16
    ) === 1;
  offset += usableRadix.status.abortDisabled / 4;

  const currentCmdSeq = parseInt(
    `0x${data.slice(offset, offset + usableRadix.status.currentCmdSeq / 4)}`,
    16
  );
  offset += usableRadix.status.currentCmdSeq / 4;

  const cmdState = parseInt(
    `0x${data.slice(offset, offset + usableRadix.status.cmdState / 4)}`,
    16
  );
  offset += usableRadix.status.cmdState / 4;

  const flowStatus = parseInt(
    `0x${data.slice(offset, offset + usableRadix.status.flowStatus / 4)}`,
    16
  );
  offset += usableRadix.status.flowStatus / 4;

  const status = {
    deviceState: deviceState.toString(16),
    deviceIdleState,
    deviceWaitingOn,
    abortDisabled,
    currentCmdSeq,
    cmdState,
    flowStatus,
    isStatus: true
  };

  return status;
};

export const encodeRawData = (
  params: RawData,
  version: PacketVersion
): string => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableRadix = radix.v3;

  const data =
    intToUintByte(params.commandType, usableRadix.commandType) + params.data;
  return data;
};

export const decodeRawData = (
  params: string,
  version: PacketVersion
): RawData => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableRadix = radix.v3;

  let offset = 0;

  const receivedCommandType = parseInt(
    params.slice(offset, offset + usableRadix.commandType / 4),
    16
  );
  offset += usableRadix.commandType / 4;

  const receivedData = params.slice(offset);

  return {
    commandType: receivedCommandType,
    data: receivedData,
    isRawData: true
  };
};

export const decodePayloadData = (payload: string, version: PacketVersion) => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableRadix = radix.v3;

  let payloadOffset = 0;

  const protobufDataSize = parseInt(
    `0x${payload.slice(
      payloadOffset,
      payloadOffset + usableRadix.dataSize / 4
    )}`,
    16
  );
  payloadOffset += usableRadix.dataSize / 4;

  const rawDataSize = parseInt(
    `0x${payload.slice(
      payloadOffset,
      payloadOffset + usableRadix.dataSize / 4
    )}`,
    16
  );
  payloadOffset += usableRadix.dataSize / 4;

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

export const formatSDKVersion = (version: string) => {
  if (version.length < 12) {
    throw new Error('SDK version should be atleast 6 bytes.');
  }

  const major = parseInt(version.slice(0, 4), 16);
  const minor = parseInt(version.slice(4, 8), 16);
  const patch = parseInt(version.slice(8, 12), 16);

  return `${major}.${minor}.${patch}`;
};
