import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import { decodeStatus, StatusData } from '../../xmodem';
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
}): Promise<StatusData> => {
  const { rawData } = await getStatusHelper({
    connection,
    version,
    maxTries,
    logsDisabled
  });

  return decodeStatus(rawData, version);
};
