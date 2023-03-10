import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion, uint8ArrayToHex } from '../../utils';
import { Query } from '../../encoders/proto/generated/core';
import { sendCommand as sendCommandHelper } from '../helpers';
import assert from '../../utils/assert';

export const sendQuery = async ({
  connection,
  appletId,
  data,
  version,
  maxTries = 5,
  sequenceNumber,
}: {
  connection: IDeviceConnection;
  appletId: number;
  data: Uint8Array;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
}): Promise<void> => {
  assert(appletId, 'Invalid appletId');
  assert(data, 'Invalid data');

  assert(appletId >= 0, 'appletId cannot be negative');
  assert(data.length > 0, 'data cannot be empty');

  const rawEncodedData = uint8ArrayToHex(
    Query.encode(Query.create({ cmd: { appletId, data } })).finish(),
  );

  return sendCommandHelper({
    connection,
    data: rawEncodedData,
    version,
    maxTries,
    sequenceNumber,
    isProto: true,
  });
};
