import {
  DeviceAppError,
  DeviceAppErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { hexToUint8Array, PacketVersion } from '../../utils';
import { Status, Result } from '../../encoders/proto/generated/core';
import { getCommandOutput as getCommandOutputHelper } from '../helpers';
import assert from '../../utils/assert';

export const getResult = async ({
  connection,
  version,
  maxTries = 5,
  sequenceNumber,
  appletId,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  appletId: number;
  maxTries?: number;
}) => {
  assert(appletId, 'Invalid appletId');

  const { isStatus, protobufData } = await getCommandOutputHelper({
    connection,
    version,
    maxTries,
    sequenceNumber,
  });

  let output: Uint8Array | Status;
  if (isStatus) {
    output = Status.decode(hexToUint8Array(protobufData));
    if (output.currentCmdSeq !== sequenceNumber) {
      throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
    }
  } else {
    const result = Result.decode(hexToUint8Array(protobufData));
    if (result.cmd?.appletId !== appletId) {
      throw new DeviceAppError(DeviceAppErrorType.INVALID_APP_ID);
    }

    output = result.cmd.data;
  }

  return { isStatus, result: output };
};
