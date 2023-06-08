import {
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

import * as config from '../../config';
import { PacketVersion, PacketVersionMap } from '../../utils';
import { decodePayloadData, encodePacket } from '../../encoders/packet';
import { decodeStatus, StatusData } from '../../encoders/raw';

import { writeCommand } from '../helpers/writeCommand';
import canRetry from '../helpers/canRetry';

export const sendAbort = async ({
  connection,
  version,
  sequenceNumber,
  maxTries = 2,
  timeout,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
  timeout?: number;
}): Promise<StatusData> => {
  assert(connection, 'Invalid connection');
  assert(version, 'Invalid version');
  assert(sequenceNumber, 'Invalid sequenceNumber');

  if (version !== PacketVersionMap.v3) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  const usableConfig = config.v3;

  const packetsList = encodePacket({
    rawData: '',
    version,
    sequenceNumber,
    packetType: usableConfig.commands.PACKET_TYPE.ABORT,
  });

  if (packetsList.length === 0) {
    throw new Error('Cound not create packets');
  }

  if (packetsList.length > 1) {
    throw new Error('Abort command has multiple packets');
  }

  let firstError: Error | undefined;

  let tries = 1;
  const innerMaxTries = maxTries;
  firstError = undefined;
  let isSuccess = false;
  let status: StatusData | undefined;

  const packet = packetsList[0];
  while (tries <= innerMaxTries && !isSuccess) {
    try {
      const receivedPacket = await writeCommand({
        connection,
        packet,
        version,
        sequenceNumber,
        ackPacketTypes: [usableConfig.commands.PACKET_TYPE.STATUS],
        timeout,
      });

      const { rawData } = decodePayloadData(
        receivedPacket.payloadData,
        version,
      );
      status = decodeStatus(rawData, version);

      if (status.currentCmdSeq !== sequenceNumber) {
        throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
      }

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

  if (!status) {
    throw new Error('Did not found status');
  }

  return status;
};
