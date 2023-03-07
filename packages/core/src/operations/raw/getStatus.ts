import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import { decodeStatus, StatusData } from '../../encoders/raw';
import { getStatus as getStatusHelper } from '../helpers';

export const getStatus = async ({
  connection,
  version,
  maxTries = 5,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  maxTries?: number;
}): Promise<StatusData> => {
  const { rawData } = await getStatusHelper({
    connection,
    version,
    maxTries,
  });

  return decodeStatus(rawData, version);
};
