import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as config from '../../config';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';
import { encodePacket } from '../../encoders/packet';

import { writeCommand } from './writeCommand';
import canRetry from './canRetry';

export const sendCommand = async ({
  connection,
  data,
  version,
  maxTries = 5,
  sequenceNumber,
  isProto
}: {
  connection: IDeviceConnection;
  data: string;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
  isProto: boolean;
}): Promise<void> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  const packetsList = encodePacket({
    data,
    version,
    sequenceNumber,
    packetType: usableConfig.commands.PACKET_TYPE.CMD,
    isProto
  });

  let firstError: Error | undefined;

  for (const packet of packetsList) {
    let tries = 1;
    const innerMaxTries = maxTries;
    firstError = undefined;
    let isSuccess = false;

    while (tries <= innerMaxTries && !isSuccess) {
      try {
        await writeCommand({
          connection,
          packet,
          version,
          sequenceNumber,
          ackPacketTypes: [usableConfig.commands.PACKET_TYPE.CMD_ACK]
        });
        isSuccess = true;
      } catch (e: any) {
        if (!canRetry(e)) {
          tries = innerMaxTries;
        }

        if (!firstError) {
          firstError = e as Error;
        }

        logger.warn('Error in sending data', e);
      }
      tries += 1;
    }

    if (firstError) {
      throw firstError;
    }
  }
};
