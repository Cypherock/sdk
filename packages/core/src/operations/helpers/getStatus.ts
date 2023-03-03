import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as config from '../../config';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';
import { decodePayloadData, encodePacket } from '../../encoders/packet';

import { writeCommand } from './writeCommand';
import canRetry from './canRetry';

export const getStatus = async ({
  connection,
  version,
  maxTries = 5,
  logsDisabled = false,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  maxTries?: number;
  logsDisabled?: boolean;
}) => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  if (!logsDisabled) logger.info('Getting status');

  const usableConfig = config.v3;

  const packetsList = encodePacket({
    data: '',
    version,
    sequenceNumber: -1,
    packetType: usableConfig.commands.PACKET_TYPE.STATUS_REQ,
    isProto: false,
  });

  if (packetsList.length === 0) {
    throw new Error('Cound not create packets');
  }

  if (packetsList.length > 1) {
    throw new Error('Status command has multiple packets');
  }

  let firstError: Error | undefined;

  let tries = 1;
  const innerMaxTries = maxTries;
  firstError = undefined;
  let isSuccess = false;
  let finalData = '';

  const packet = packetsList[0];
  while (tries <= innerMaxTries && !isSuccess) {
    try {
      const receivedPacket = await writeCommand({
        connection,
        packet,
        version,
        sequenceNumber: -1,
        ackPacketTypes: [usableConfig.commands.PACKET_TYPE.STATUS],
      });
      finalData = receivedPacket.payloadData;
      isSuccess = true;
    } catch (e: any) {
      // Don't retry if connection closed
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

  return decodePayloadData(finalData, version);
};
