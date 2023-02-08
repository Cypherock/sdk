import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection
} from '@cypherock/sdk-interfaces';
import * as config from '../config';
import { logger, PacketVersion, PacketVersionMap } from '../utils';
import {
  decodePayloadData,
  decodeStatus,
  encodePacket,
  StatusData
} from '../xmodem';

import { writeCommand } from './helpers/writeCommand';

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
}): Promise<StatusData> => {
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
  let status: StatusData | undefined;

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

      const { rawData } = decodePayloadData(
        receivedPacket.payloadData,
        version
      );
      status = decodeStatus(rawData, version);

      if (status.currentCmdSeq !== sequenceNumber) {
        throw new Error('Abort rejected by device');
      }

      isSuccess = true;
    } catch (e) {
      // Don't retry if connection closed
      if (e instanceof DeviceError) {
        if (
          [
            DeviceErrorType.CONNECTION_CLOSED,
            DeviceErrorType.CONNECTION_NOT_OPEN,
            DeviceErrorType.NOT_CONNECTED,
            DeviceErrorType.WRITE_REJECTED,
            DeviceErrorType.DEVICE_ABORT,
            DeviceErrorType.PROCESS_ABORTED_BY_USER
          ].includes(e.errorType)
        ) {
          tries = innerMaxTries;
        }
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