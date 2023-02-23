import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection,
  CmdState,
  DeviceIdleState,
  IRawData,
  IStatusData
} from '@cypherock/sdk-interfaces';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';

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
  onStatus: (status: IStatusData) => void;
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
}: IWaitForCommandOutputParams): Promise<IRawData> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  logger.info(
    `Trying to receive output with command ${expectedCommandTypes.join(' ')}`
  );

  let lastStatus = -1;
  let lastState = -1;
  let lastDeviceIdleState = 0;
  let lastDeviceWaitingOn = 0;

  while (true) {
    const response = await getCommandOutput({
      connection,
      version,
      maxTries,
      sequenceNumber
    });

    if (response.isRawData) {
      const resp = response as IRawData;
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

    const status = response as IStatusData;

    if (
      lastState !== status.cmdState ||
      lastStatus !== status.flowStatus ||
      lastDeviceIdleState !== status.deviceIdleState ||
      lastDeviceWaitingOn !== status.deviceWaitingOn
    ) {
      logger.info(status);
    }

    lastState = status.cmdState;
    lastStatus = status.flowStatus;
    lastDeviceIdleState = status.deviceIdleState;
    lastDeviceWaitingOn = status.deviceWaitingOn;

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
      onStatus(response as IStatusData);
    }

    await sleep(options?.interval || 200);
  }
};
