import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection
} from '@cypherock/sdk-interfaces';
import { logger, PacketVersion, PacketVersionMap } from '../utils';
import { CmdState, DeviceIdleState, RawData, StatusData } from '../xmodem';

import { getCommandOutput } from './getCommandOutput';

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export interface IWaitForCommandOutputParams {
  connection: IDeviceConnection;
  sequenceNumber: number;
  expectedCommandTypes: number[];
  onStatus: (status: StatusData) => void;
  version: PacketVersion;
  maxTries?: number;
  options?: { interval?: number };
}

export const waitForCommandOutput = async ({
  connection,
  sequenceNumber,
  expectedCommandTypes,
  onStatus,
  options,
  version,
  maxTries = 5
}: IWaitForCommandOutputParams): Promise<RawData> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  logger.info(
    `Trying to receive output with command ${expectedCommandTypes.join(' ')}`
  );

  let lastStatus = -1;
  let lastState = -1;
  let lastDeviceState = '';

  while (true) {
    const response = await getCommandOutput({
      connection,
      version,
      maxTries,
      sequenceNumber
    });

    if (response.isRawData) {
      const resp = response as RawData;
      logger.info('Output received', response);

      if (
        expectedCommandTypes.length > 0 &&
        !expectedCommandTypes.includes(resp.commandType)
      ) {
        throw new Error(
          `Invalid commandType. Expected commandTypes: ${expectedCommandTypes.join(
            ','
          )}`
        );
      }
      return resp;
    }

    const status = response as StatusData;

    if (
      lastState !== status.cmdState ||
      lastStatus !== status.flowStatus ||
      lastDeviceState !== status.deviceState
    ) {
      logger.info(status);
    }

    lastState = status.cmdState;
    lastStatus = status.flowStatus;
    lastDeviceState = status.deviceState;

    if (status.currentCmdSeq !== sequenceNumber) {
      throw new DeviceError(DeviceErrorType.EXECUTING_OTHER_COMMAND);
    }

    if (
      [
        CmdState.CMD_STATE_DONE,
        CmdState.CMD_STATE_FAILED,
        CmdState.CMD_STATE_INVALID_CMD
      ].includes(status.cmdState)
    ) {
      throw new Error(
        'Command status is done or rejected, but no output is received'
      );
    }

    if (status.deviceIdleState === DeviceIdleState.USB) {
      onStatus(response as StatusData);
    }

    await sleep(options?.interval || 200);
  }
};
