import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { hexToUint8Array, PacketVersion } from '../../utils';
import { Status, Result } from '../../encoders/proto/generated/core';
import { getCommandOutput as getCommandOutputHelper } from '../helpers';

export const getCommandOutput = async ({
  connection,
  version,
  maxTries = 5,
  sequenceNumber,
  appletId
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  appletId: number;
  maxTries?: number;
}) => {
  const { isStatus, rawData } = await getCommandOutputHelper({
    connection,
    version,
    maxTries,
    sequenceNumber
  });

  let output: Uint8Array | Status;
  if (isStatus) {
    output = Status.decode(hexToUint8Array(rawData));
  } else {
    const result = Result.decode(hexToUint8Array(rawData));
    if (result.cmd?.appletId !== appletId) {
      throw new Error(`Invalid result. Expected appletId: ${appletId}`);
    }

    output = result.cmd.data;
  }

  return { isStatus, result: output };
};
