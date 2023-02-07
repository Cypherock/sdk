import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection
} from '@cypherock/sdk-interfaces';
import * as config from '../config';
import { logger, PacketVersion, PacketVersionMap } from '../utils';
import { encodePacket, encodeRawData } from '../xmodem';

import { waitForPacket } from './waitForPacket';

const writeCommand = async ({
  connection,
  packet,
  version,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  packet: Uint8Array;
  version: PacketVersion;
  sequenceNumber: number;
}): Promise<void> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  if (!connection.isConnected()) {
    throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    try {
      const ackPromise = waitForPacket({
        connection,
        version,
        packetTypes: [usableConfig.commands.PACKET_TYPE.CMD_ACK],
        sequenceNumber
      });

      connection.send(packet).catch(error => {
        logger.error(error);
        if (!connection.isConnected()) {
          reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
        } else {
          reject(new DeviceError(DeviceErrorType.WRITE_ERROR));
        }
        ackPromise.cancel();
      });

      ackPromise
        .then(() => {
          if (ackPromise.isCancelled()) {
            return;
          }

          resolve();
        })
        .catch(error => {
          if (ackPromise.isCancelled()) {
            return;
          }

          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const sendCommand = async ({
  connection,
  commandType,
  data,
  version,
  maxTries = 5,
  sequenceNumber
}: {
  connection: IDeviceConnection;
  commandType: number;
  data: string;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
}): Promise<void> => {
  if (version !== PacketVersionMap.v3) {
    throw new Error('Only v3 packets are supported');
  }

  const usableConfig = config.v3;

  const packetsList = encodePacket({
    data: encodeRawData({ commandType, data }, version),
    version,
    sequenceNumber,
    packetType: usableConfig.commands.PACKET_TYPE.CMD
  });

  logger.info(`Sending command ${commandType} : ${data}`);

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
          sequenceNumber
        });
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

        logger.warn('Error in sending data', e);
      }
      tries += 1;
    }

    if (firstError) {
      throw firstError;
    }
  }

  logger.info(
    `Sent command ${commandType} : containing ${packetsList.length} packets.`
  );
};
