import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { hexToUint8Array, PacketVersion } from '../../utils';
import { getStatus as getStatusHelper } from '../helpers';
import { Status } from '../../encoders/proto/generated/core';

export const getStatus = async ({
  connection,
  version,
  maxTries = 5,
  logsDisabled = false,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  maxTries?: number;
  logsDisabled?: boolean;
}) => {
  const { protobufData } = await getStatusHelper({
    connection,
    version,
    maxTries,
    logsDisabled,
  });

  return Status.decode(hexToUint8Array(protobufData));
};
