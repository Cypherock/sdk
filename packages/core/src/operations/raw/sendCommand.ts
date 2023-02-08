import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import { encodeRawData } from '../../encoders/raw';
import { sendCommand as sendCommandHelper } from '../helpers';

export const sendCommand = async ({
  connection,
  commandType,
  data,
  version,
  maxTries = 5,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  commandType: number;
  data: string;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
}): Promise<void> => {
  const rawEncodedData = encodeRawData({ commandType, data }, version);

  return sendCommandHelper({
    connection,
    commandType,
    data: rawEncodedData,
    version,
    maxTries,
    sequenceNumber,
    isProto: false
  });
};
