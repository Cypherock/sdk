import * as config from '../../config';
import { intToUintByte, PacketVersion, PacketVersionMap } from '../../utils';
import { RawData, StatusData } from './types';

export * from './types';

export const decodeStatus = (
  data: string,
  version: PacketVersion
): StatusData => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  let offset = 0;

  const deviceState = parseInt(
    `0x${data.slice(
      offset,
      offset + usableConfig.radix.status.deviceState / 4
    )}`,
    16
  );
  offset += usableConfig.radix.status.deviceState / 4;

  const num = deviceState & 0xff;
  const deviceIdleState = num & 0xf;
  const deviceWaitingOn = num >> 4;

  const abortDisabled =
    parseInt(
      `0x${data.slice(
        offset,
        offset + usableConfig.radix.status.abortDisabled / 4
      )}`,
      16
    ) === 1;
  offset += usableConfig.radix.status.abortDisabled / 4;

  const currentCmdSeq = parseInt(
    `0x${data.slice(
      offset,
      offset + usableConfig.radix.status.currentCmdSeq / 4
    )}`,
    16
  );
  offset += usableConfig.radix.status.currentCmdSeq / 4;

  const cmdState = parseInt(
    `0x${data.slice(offset, offset + usableConfig.radix.status.cmdState / 4)}`,
    16
  );
  offset += usableConfig.radix.status.cmdState / 4;

  const flowStatus = parseInt(
    `0x${data.slice(
      offset,
      offset + usableConfig.radix.status.flowStatus / 4
    )}`,
    16
  );
  offset += usableConfig.radix.status.flowStatus / 4;

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

  const usableConfig = config.v3;

  const data =
    intToUintByte(params.commandType, usableConfig.radix.commandType) +
    params.data;
  return data;
};

export const decodeRawData = (
  params: string,
  version: PacketVersion
): RawData => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  let offset = 0;

  const receivedCommandType = parseInt(
    params.slice(offset, offset + usableConfig.radix.commandType / 4),
    16
  );
  offset += usableConfig.radix.commandType / 4;

  const receivedData = params.slice(offset);

  return {
    commandType: receivedCommandType,
    data: receivedData,
    isRawData: true
  };
};
