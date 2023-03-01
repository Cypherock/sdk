import {
  IDeviceConnection,
  DeviceAppError,
  DeviceAppErrorType
} from '@cypherock/sdk-interfaces';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';
import {
  CmdState,
  DeviceIdleState,
  Status
} from '../../encoders/proto/generated/core';

import { getCommandOutput } from './getCommandOutput';

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export interface IWaitForCommandOutputParams {
  connection: IDeviceConnection;
  sequenceNumber: number;
  appletId: number;
  onStatus?: (status: Status) => void;
  version: PacketVersion;
  maxTries?: number;
  options?: { interval?: number };
}

export const waitForCommandOutput = async ({
  connection,
  sequenceNumber,
  appletId,
  onStatus,
  options,
  version,
  maxTries = 5
}: IWaitForCommandOutputParams): Promise<Uint8Array> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  let lastStatus = -1;
  let lastState = -1;
  let lastDeviceIdleState = -1;
  let lastDeviceWaitingOn = -1;

  while (true) {
    const response = await getCommandOutput({
      connection,
      version,
      appletId,
      maxTries,
      sequenceNumber
    });

    if (!response.isStatus) {
      const resp = response.result as Uint8Array;
      logger.info('Output received', resp);
      return resp;
    }

    const status = response.result as Status;

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
      throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
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

    if (status.deviceIdleState === DeviceIdleState.DEVICE_IDLE_STATE_USB) {
      if (onStatus) {
        onStatus(response.result as Status);
      }
    }

    await sleep(options?.interval || 200);
  }
};
