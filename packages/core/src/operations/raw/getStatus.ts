import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import { decodeStatus, StatusData } from '../../encoders/raw';
import { getStatus as getStatusHelper } from '../helpers';

export const getStatus = async ({
  connection,
  version,
  maxTries = 5,
  timeout,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  maxTries?: number;
  timeout?: number;
}): Promise<StatusData> => {
  const { rawData } = await getStatusHelper({
    connection,
    version,
    maxTries,
    timeout,
  });

  return decodeStatus(rawData, version);
};
