import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import { encodeRawData } from '../../encoders/raw';
import { sendCommand as sendCommandHelper } from '../helpers';

export const sendCommand = async ({
  connection,
  commandType,
  data,
  version,
  sequenceNumber,
  maxTries = 5,
  timeout,
}: {
  connection: IDeviceConnection;
  commandType: number;
  data: string;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
  timeout?: number;
}): Promise<void> => {
  const rawEncodedData = encodeRawData({ commandType, data }, version);

  return sendCommandHelper({
    connection,
    rawData: rawEncodedData,
    version,
    maxTries,
    sequenceNumber,
    timeout,
  });
};
