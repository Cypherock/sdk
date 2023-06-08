import {
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

import * as config from '../../config';
import { PacketVersion, PacketVersionMap } from '../../utils';
import { decodePayloadData, encodePacket } from '../../encoders/packet';

import { writeCommand } from './writeCommand';
import canRetry from './canRetry';

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
  assert(connection, 'Invalid connection');
  assert(version, 'Invalid version');

  if (version !== PacketVersionMap.v3) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  const usableConfig = config.v3;

  const packetsList = encodePacket({
    rawData: '',
    version,
    sequenceNumber: -1,
    packetType: usableConfig.commands.PACKET_TYPE.STATUS_REQ,
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
        timeout,
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
    }
    tries += 1;
  }

  if (!isSuccess && firstError) {
    throw firstError;
  }

  return decodePayloadData(finalData, version);
};
