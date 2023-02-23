import {
  IDeviceConnection,
  IRawData,
  IStatusData
} from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import { decodeRawData, decodeStatus } from '../../encoders/raw';
import { getCommandOutput as getCommandOutputHelper } from '../helpers';

export const getCommandOutput = async ({
  connection,
  version,
  maxTries = 5,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
}) => {
  const { isStatus, rawData } = await getCommandOutputHelper({
    connection,
    version,
    maxTries,
    sequenceNumber
  });

  let output: IRawData | IStatusData;
  if (isStatus) {
    output = decodeStatus(rawData, version);
  } else {
    output = decodeRawData(rawData, version);
  }

  return output;
};
