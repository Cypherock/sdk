import {
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert, sleep } from '@cypherock/sdk-utils';
import { PacketVersion, PacketVersionMap } from '../../utils';
import {
  CmdState,
  DeviceIdleState,
  RawData,
  StatusData,
} from '../../encoders/raw';

import { getCommandOutput } from './getCommandOutput';

export interface IWaitForCommandOutputParams {
  connection: IDeviceConnection;
  sequenceNumber: number;
  expectedCommandTypes: number[];
  onStatus?: (status: StatusData) => void;
  version: PacketVersion;
  options?: { interval?: number; timeout?: number; maxTries?: number };
}

export const waitForCommandOutput = async ({
  connection,
  sequenceNumber,
  expectedCommandTypes,
  onStatus,
  options,
  version,
}: IWaitForCommandOutputParams): Promise<RawData> => {
  assert(connection, 'Invalid connection');
  assert(expectedCommandTypes, 'Invalid expectedCommandTypes');
  assert(sequenceNumber, 'Invalid sequenceNumber');
  assert(version, 'Invalid version');

  assert(
    expectedCommandTypes.length > 0,
    'expectedCommandTypes should not be empty',
  );

  if (version !== PacketVersionMap.v3) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  while (true) {
    const response = await getCommandOutput({
      connection,
      version,
      maxTries: options?.maxTries ?? 5,
      sequenceNumber,
      timeout: options?.timeout,
    });

    if (response.isRawData) {
      const resp = response as RawData;

      if (
        expectedCommandTypes.length > 0 &&
        !expectedCommandTypes.includes(resp.commandType)
      ) {
        throw new DeviceAppError(DeviceAppErrorType.INVALID_MSG_FROM_DEVICE);
      }
      return resp;
    }

    const status = response as StatusData;

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

    if (status.deviceIdleState === DeviceIdleState.USB) {
      if (onStatus) {
        onStatus(response as StatusData);
      }
    }

    await sleep(options?.interval ?? 200);
  }
};
