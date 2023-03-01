import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion, uint8ArrayToHex } from '../../utils';
import { Query } from '../../encoders/proto/generated/core';
import { sendCommand as sendCommandHelper } from '../helpers';

export const sendCommand = async ({
  connection,
  appletId,
  data,
  version,
  maxTries = 5,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  appletId: number;
  data: Uint8Array;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
}): Promise<void> => {
  const rawEncodedData = uint8ArrayToHex(
    Query.encode(Query.create({ cmd: { appletId, data } })).finish()
  );

  return sendCommandHelper({
    connection,
    data: rawEncodedData,
    version,
    maxTries,
    sequenceNumber,
    isProto: true
  });
};
