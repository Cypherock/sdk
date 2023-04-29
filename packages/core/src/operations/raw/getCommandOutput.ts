import {
  DeviceAppError,
  DeviceAppErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { PacketVersion } from '../../utils';
import {
  decodeRawData,
  decodeStatus,
  RawData,
  StatusData,
} from '../../encoders/raw';
import { getCommandOutput as getCommandOutputHelper } from '../helpers';

export const getCommandOutput = async ({
  connection,
  version,
  maxTries = 5,
  sequenceNumber,
  timeout,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
  timeout?: number;
}) => {
  const { isStatus, rawData } = await getCommandOutputHelper({
    connection,
    version,
    maxTries,
    sequenceNumber,
    timeout,
  });

  let output: RawData | StatusData;
  if (isStatus) {
    const status = decodeStatus(rawData, version);
    if (status.currentCmdSeq !== sequenceNumber) {
      throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
    }

    output = status;
  } else {
    output = decodeRawData(rawData, version);
  }

  return output;
};
