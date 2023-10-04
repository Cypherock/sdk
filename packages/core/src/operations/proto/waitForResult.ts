import {
  IDeviceConnection,
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import { assert, sleep, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';
import {
  CmdState,
  DeviceIdleState,
  Status,
} from '../../encoders/proto/generated/core';

import { getResult } from './getResult';

export interface IWaitForCommandOutputParams {
  connection: IDeviceConnection;
  sequenceNumber: number;
  appletId: number;
  onStatus?: (status: Status) => void;
  version: PacketVersion;
  options?: { interval?: number; timeout?: number; maxTries?: number };
  allowCoreData?: boolean;
}

export const waitForResult = async ({
  connection,
  sequenceNumber,
  appletId,
  onStatus,
  options,
  version,
  allowCoreData,
}: IWaitForCommandOutputParams): Promise<Uint8Array> => {
  assert(connection, 'Invalid connection');
  assert(sequenceNumber, 'Invalid sequenceNumber');
  assert(appletId, 'Invalid appletId');
  assert(version, 'Invalid version');

  assert(appletId >= 0, 'appletId cannot be negative');

  if (version !== PacketVersionMap.v3) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  while (true) {
    const response = await getResult({
      connection,
      version,
      appletId,
      maxTries: options?.maxTries ?? 5,
      sequenceNumber,
      timeout: options?.timeout,
      allowCoreData,
    });

    if (!response.isStatus) {
      const resp = response.result as Uint8Array;

      logger.debug('Received result', {
        result: uint8ArrayToHex(resp),
        appletId,
      });

      return resp;
    }

    const status = response.result as Status;

    if (status.currentCmdSeq !== sequenceNumber) {
      throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
    }

    if (
      [
        CmdState.CMD_STATE_DONE,
        CmdState.CMD_STATE_FAILED,
        CmdState.CMD_STATE_INVALID_CMD,
      ].includes(status.cmdState)
    ) {
      throw new Error(
        'Command status is done or rejected, but no output is received',
      );
    }

    if (status.deviceIdleState === DeviceIdleState.DEVICE_IDLE_STATE_USB) {
      if (onStatus) {
        onStatus(response.result as Status);
      }
    }

    await sleep(options?.interval ?? 200);
  }
};
