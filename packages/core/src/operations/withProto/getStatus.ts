import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import { getStatus as getStatusHelper } from '../helpers';

export const getStatus = async ({
  connection,
  version,
  maxTries = 5,
  logsDisabled = false
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
    logsDisabled
  });

  return protobufData;
};
