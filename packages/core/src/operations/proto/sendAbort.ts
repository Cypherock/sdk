import {
  IDeviceConnection,
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import { hexToUint8Array } from '@cypherock/sdk-utils';

import * as config from '../../config';
import { logger, PacketVersion, PacketVersionMap } from '../../utils';
import { decodePayloadData, encodePacket } from '../../encoders/packet';
import { Status } from '../../encoders/proto/generated/core';

import { writeCommand } from '../helpers/writeCommand';
import canRetry from '../helpers/canRetry';
import { waitForIdle } from './waitForIdle';

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
}): Promise<Status> => {
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

  logger.debug('Sending abort');

  let firstError: Error | undefined;

  let tries = 1;
  const innerMaxTries = maxTries;
  firstError = undefined;
  let isSuccess = false;
  let status: Status | undefined;

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

      const { protobufData } = decodePayloadData(
        receivedPacket.payloadData,
        version,
      );
      status = Status.decode(hexToUint8Array(protobufData));

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

  await waitForIdle({ connection, version });

  return status;
};
