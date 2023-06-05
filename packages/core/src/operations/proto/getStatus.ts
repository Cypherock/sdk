import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { hexToUint8Array } from '@cypherock/sdk-utils';

import { logger, PacketVersion } from '../../utils';
import { getStatus as getStatusHelper } from '../helpers';
import { Status } from '../../encoders/proto/generated/core';

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
}) => {
  const { protobufData } = await getStatusHelper({
    connection,
    version,
    maxTries,
    timeout,
  });

  const status = Status.decode(hexToUint8Array(protobufData));

  logger.debug('Received status', status);

  return status;
};
