import {
  DeviceAppError,
  DeviceAppErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert, hexToUint8Array } from '@cypherock/sdk-utils';

import { PacketVersion } from '../../utils';
import { Status, Msg, ErrorType } from '../../encoders/proto/generated/core';
import { getCommandOutput as getCommandOutputHelper } from '../helpers';
import { AppVersionResponse } from '../../encoders/proto/generated/version';

export const getResult = async ({
  connection,
  version,
  maxTries = 5,
  sequenceNumber,
  appletId,
  timeout,
  allowCoreData,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  appletId: number;
  maxTries?: number;
  timeout?: number;
  allowCoreData?: boolean;
}) => {
  assert(appletId, 'Invalid appletId');

  const { isStatus, protobufData, rawData } = await getCommandOutputHelper({
    connection,
    version,
    maxTries,
    sequenceNumber,
    timeout,
  });

  let output: Uint8Array | Status;
  if (isStatus) {
    output = Status.decode(hexToUint8Array(protobufData));
    if (output.currentCmdSeq !== sequenceNumber) {
      throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
    }
  } else {
    const result = Msg.decode(hexToUint8Array(protobufData));
    if (result.error) {
      const errorMap: Record<ErrorType, DeviceAppErrorType> = {
        [ErrorType.NO_ERROR]: DeviceAppErrorType.UNKNOWN_ERROR,
        [ErrorType.UNRECOGNIZED]: DeviceAppErrorType.UNKNOWN_ERROR,
        [ErrorType.UNKNOWN_APP]: DeviceAppErrorType.UNKNOWN_APP,
        [ErrorType.INVALID_MSG]: DeviceAppErrorType.INVALID_MSG,
        [ErrorType.APP_NOT_ACTIVE]: DeviceAppErrorType.APP_NOT_ACTIVE,
        [ErrorType.APP_TIMEOUT_OCCURRED]: DeviceAppErrorType.APP_TIMEOUT,
      };

      throw new DeviceAppError(errorMap[result.error.type]);
    }

    output = new Uint8Array();

    if (!allowCoreData || result.cmd) {
      if (!result.cmd) {
        throw new DeviceAppError(DeviceAppErrorType.INVALID_MSG_FROM_DEVICE);
      }

      if (result.cmd.appletId !== appletId) {
        throw new DeviceAppError(DeviceAppErrorType.INVALID_APP_ID_FROM_DEVICE);
      }
      output = hexToUint8Array(rawData);
    } else if (result.appVersion?.response) {
      output = AppVersionResponse.encode(result.appVersion.response).finish();
    }
  }

  return { isStatus, result: output };
};
