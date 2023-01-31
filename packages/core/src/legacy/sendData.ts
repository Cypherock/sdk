import { DeviceError, DeviceErrorType } from '@cypherock/sdk-interfaces';
import { commands, constants } from '../config';
import { logger } from '../utils';
import { PacketVersion, PacketVersionMap } from '../utils/versions';
import { xmodemEncode } from '../xmodem/legacy';
import { DeviceConnectionInterface, PacketData } from '../types';

/**
 * Writes the packet to the SerialPort on the given connection,
 * and rejects the promise if there is no acknowledgment from the device
 */
export const writePacket = (
  connection: DeviceConnectionInterface,
  packet: any,
  version: PacketVersion
) => {
  let usableConstants = constants.v1;
  const usableCommands = commands.v1;

  if (!connection.isConnected()) {
    throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
  }

  if (version === PacketVersionMap.v2) {
    usableConstants = constants.v2;
  }

  /**
   * Be sure to remove all listeners and timeout.
   */
  return new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout;

    function dataListener(ePacket: PacketData) {
      if (timeout) {
        clearTimeout(timeout);
      }
      connection.removeListener('ack', dataListener);
      // eslint-disable-next-line
      connection.removeListener('close', onClose);

      switch (ePacket.commandType) {
        case usableCommands.ACK_PACKET:
          resolve();
          return;
        case usableCommands.NACK_PACKET:
          logger.warn('Received NACK');
          reject(new DeviceError(DeviceErrorType.WRITE_ERROR));
          // eslint-disable-next-line
          return;
        default:
        // Do nothing
      }
    }

    function onClose(err: any) {
      if (timeout) {
        clearTimeout(timeout);
      }

      connection.removeListener('ack', dataListener);
      connection.removeListener('close', onClose);

      if (err) {
        logger.error(err);
      }

      reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
    }

    connection.addListener('ack', dataListener);
    connection.addListener('close', onClose);

    connection.write(packet).catch(error => {
      if (timeout) {
        clearTimeout(timeout);
      }
      connection.removeListener('ack', dataListener);
      connection.removeListener('close', onClose);
      logger.error(error);
      reject(new DeviceError(DeviceErrorType.WRITE_ERROR));
    });

    timeout = setTimeout(() => {
      connection.removeListener('ack', dataListener);
      connection.removeListener('close', onClose);
      reject(new DeviceError(DeviceErrorType.WRITE_TIMEOUT));
    }, usableConstants.ACK_TIME);
  });
};

/**
 * Sends data to the hardware on the given connection instance.
 * It takes in string
 *
 * @example
 * ```typescript
 * import {createPort, sendData} from '@cypherock/communication'
 *
 * const connection = await createPort();
 *
 * await sendData(connection, 21, "102030");
 * ```
 *
 * @param connection - SerialPort connection instance
 * @param command - command number for the message
 * @param data - data in hex format
 * @return
 */
export const sendData = async (
  connection: DeviceConnectionInterface,
  command: number,
  data: string,
  version: PacketVersion,
  maxTries = 5
) => {
  const packetsList = xmodemEncode(data, command, version);
  logger.info(
    `Sending command ${command} : containing ${packetsList.length} packets.`
  );
  /**
   * Create a list of each packet and self contained retries and listener
   */
  const dataList = packetsList.map(d => async (resolve: any, reject: any) => {
    let tries = 1;
    let localMaxTries = maxTries;
    if (command === 255) localMaxTries = 1;

    let firstError: Error | undefined;
    while (tries <= localMaxTries) {
      try {
        // eslint-disable-next-line
        await writePacket(connection, d, version);
        resolve(true);
        return;
      } catch (e) {
        // Don't retry if connection closed
        if (e instanceof DeviceError) {
          if (
            [
              DeviceErrorType.CONNECTION_CLOSED,
              DeviceErrorType.CONNECTION_NOT_OPEN,
              DeviceErrorType.NOT_CONNECTED
            ].includes(e.code)
          ) {
            tries = localMaxTries;
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
      reject(firstError);
    } else {
      reject(new DeviceError(DeviceErrorType.WRITE_TIMEOUT));
    }
  });

  // eslint-disable-next-line
  for (const i of dataList) {
    try {
      // eslint-disable-next-line
      await new Promise((res, rej) => {
        i(res, rej);
      });
    } catch (e) {
      if (e) {
        throw e;
      }

      throw new DeviceError(DeviceErrorType.WRITE_TIMEOUT);
    }
  }
  logger.info(`Sent command ${command} : ${data}`);
};
