import { IDeviceConnection , DeviceAppError , DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import * as config from '../../config';
import {
  hexToUint8Array,
  logger,
  PacketVersion,
  PacketVersionMap
} from '../../utils';
import { decodePayloadData, encodePacket } from '../../encoders/packet';
import { Status } from '../../encoders/proto/generated/core';

import { writeCommand } from '../helpers/writeCommand';
import canRetry from '../helpers/canRetry';

export const sendAbort = async ({
  connection,
  version,
  sequenceNumber,
  maxTries = 2
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
}): Promise<Status> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  const packetsList = encodePacket({
    data: '',
    version,
    sequenceNumber,
    packetType: usableConfig.commands.PACKET_TYPE.ABORT,
    isProto: false
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
  let status: Status | undefined;

  const packet = packetsList[0];
  while (tries <= innerMaxTries && !isSuccess) {
    try {
      const receivedPacket = await writeCommand({
        connection,
        packet,
        version,
        sequenceNumber,
        ackPacketTypes: [usableConfig.commands.PACKET_TYPE.STATUS]
      });

      const { protobufData } = decodePayloadData(
        receivedPacket.payloadData,
        version
      );
      status = Status.decode(hexToUint8Array(protobufData));

      if (status.currentCmdSeq !== sequenceNumber) {
        throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
      }

      isSuccess = true;
    } catch (e) {
      // Don't retry if connection closed
      if (!canRetry(e)) {
        tries = innerMaxTries;
      }

      if (!firstError) {
        firstError = e as Error;
      }

      logger.warn('Error in sending data for abort');
      logger.warn(e);
    }
    tries += 1;
  }

  if (firstError) {
    throw firstError;
  }

  if (!status) {
    throw new Error('Did not found status');
  }

  return status;
};
