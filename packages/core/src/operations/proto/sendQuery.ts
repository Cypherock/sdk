import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { assert, uint8ArrayToHex } from '@cypherock/sdk-utils';

import { logger, PacketVersion } from '../../utils';
import { Msg } from '../../encoders/proto/generated/core';
import { sendCommand as sendCommandHelper } from '../helpers';

export const sendQuery = async ({
  connection,
  appletId,
  data,
  version,
  maxTries = 5,
  sequenceNumber,
  timeout,
}: {
  connection: IDeviceConnection;
  appletId: number;
  data: Uint8Array;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
  timeout?: number;
}): Promise<void> => {
  assert(appletId, 'Invalid appletId');
  assert(data, 'Invalid data');

  assert(appletId >= 0, 'appletId cannot be negative');
  assert(data.length > 0, 'data cannot be empty');

  const rawData = uint8ArrayToHex(data);
  logger.debug('Sending query', { appletId, rawData });

  const msgData = uint8ArrayToHex(
    Msg.encode(Msg.create({ cmd: { appletId } })).finish(),
  );

  return sendCommandHelper({
    connection,
    protoData: msgData,
    rawData,
    version,
    maxTries,
    sequenceNumber,
    timeout,
  });
};
