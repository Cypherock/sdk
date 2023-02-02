import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { commands, constants } from '../config';
import { logger } from '../utils';
import { PacketVersion, PacketVersionMap } from '../utils/versions';
import { xmodemEncode, xmodemDecode } from '../xmodem/legacy';

/**
 * Writes the packet to the SerialPort on the given connection,
 * and rejects the promise if there is no acknowledgment from the device
 */
export const writePacket = (
  connection: IDeviceConnection,
  packet: Uint8Array,
  version: PacketVersion,
  skipPacketIds: string[]
) => {
  let usableConstants = constants.v1;
  const usableCommands = commands.v1;

  if (!connection.isConnected()) {
    throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
  }

  if (version === PacketVersionMap.v2) {
    usableConstants = constants.v2;
  }

  console.log({ skipPacketIds });

  /**
   * Be sure to remove all listeners and timeout.
   */
  return new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout;
    let recheckTimeout: NodeJS.Timeout;

    function cleanUp() {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (recheckTimeout) {
        clearTimeout(recheckTimeout);
      }
    }

    async function recheckAck() {
      try {
        logger.info('Recheck triggred');
        if (!connection.isConnected()) {
          reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
          return;
        }

        const pool = await connection.peek();
        console.log({ pool });

        // eslint-disable-next-line
        for (const poolItem of pool) {
          const { data } = poolItem;
          if (skipPacketIds.includes(poolItem.id)) {
            logger.info(`Skipped: ${data}`);
            // eslint-disable-next-line
            continue;
          }

          skipPacketIds.push(poolItem.id);

          logger.info(`Received: ${data}`);

          const packetList = xmodemDecode(data, version);
          console.log(packetList);

          // eslint-disable-next-line
          for (const packet of packetList) {
            console.log(packet);
            switch (packet.commandType) {
              case usableCommands.ACK_PACKET:
                console.log('ACK PACKET');
                cleanUp();
                resolve();
                return;
              case usableCommands.NACK_PACKET:
                logger.warn('Received NACK');
                cleanUp();
                reject(new DeviceError(DeviceErrorType.WRITE_ERROR));
                // eslint-disable-next-line
                return;
              default:
              // Do nothing
            }
          }
        }

        recheckTimeout = setTimeout(recheckAck, usableConstants.RECHECK_TIME);
      } catch (error) {
        console.log(error);
        cleanUp();
        reject(new DeviceError(DeviceErrorType.UNKNOWN_COMMUNICATION_ERROR));
      }
    }

    logger.info(`Writing packet: ${packet}`);
    connection
      .send(packet)
      .then(() => {
        logger.info(`Writing packet done: ${packet}`);
        recheckTimeout = setTimeout(recheckAck, usableConstants.RECHECK_TIME);
      })
      .catch(error => {
        logger.info(`Writing packet error: ${error}`);
        cleanUp();
        logger.error(error);
        reject(new DeviceError(DeviceErrorType.WRITE_ERROR));
      });

    timeout = setTimeout(() => {
      logger.info('Timeout triggred');
      cleanUp();
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
  connection: IDeviceConnection,
  command: number,
  data: string,
  version: PacketVersion,
  maxTries = 5
) => {
  const skipPacketIds: string[] = [];
  const packetsList = xmodemEncode(data, command, version);
  logger.info(
    `Sending command ${command} : containing ${packetsList.length} packets.`
  );
  /**
   * Create a list of each packet and self contained retries and listener
   */
  // eslint-disable-next-line
  for (const packet of packetsList) {
    let tries = 1;
    let isDone = false;
    let localMaxTries = maxTries;
    if (command === 255) localMaxTries = 1;

    let firstError: Error | undefined;
    while (!isDone && tries <= localMaxTries) {
      try {
        // eslint-disable-next-line
        await writePacket(connection, packet, version, skipPacketIds);
        isDone = true;
        logger.info('Write packet exit');
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

    if (!isDone) {
      if (firstError) {
        throw firstError;
      } else {
        throw new DeviceError(DeviceErrorType.WRITE_TIMEOUT);
      }
    }
  }

  logger.info(`Sent command ${command} : ${data}`);
};
