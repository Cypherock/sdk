import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  IDeviceConnection,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import * as config from '../../config';
import { isHex, logger, PacketVersion, PacketVersionMap } from '../../utils';
import { xmodemEncode, xmodemDecode } from '../../encoders/packet/legacy';
import assert from '../../utils/assert';

/**
 * Writes the packet to the SerialPort on the given connection,
 * and rejects the promise if there is no acknowledgment from the device
 */
export const writePacket = (
  connection: IDeviceConnection,
  packet: Uint8Array,
  version: PacketVersion,
  skipPacketIds: string[],
) => {
  let usableConfig = config.v1;

  if (!connection.isConnected()) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.CONNECTION_CLOSED,
    );
  }

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

  /**
   * Be sure to remove all listeners and timeout.
   */
  return new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | undefined;
    let recheckTimeout: NodeJS.Timeout | undefined;

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
        if (!connection.isConnected()) {
          reject(
            new DeviceConnectionError(
              DeviceConnectionErrorType.CONNECTION_CLOSED,
            ),
          );
          return;
        }

        const pool = await connection.peek();

        // eslint-disable-next-line
        for (const poolItem of pool) {
          const { data } = poolItem;
          if (skipPacketIds.includes(poolItem.id)) {
            // eslint-disable-next-line
            continue;
          }

          skipPacketIds.push(poolItem.id);

          const packetList = xmodemDecode(data, version);

          // eslint-disable-next-line
          for (const packet of packetList) {
            switch (packet.commandType) {
              case usableConfig.commands.ACK_PACKET:
                cleanUp();
                resolve();
                return;
              case usableConfig.commands.NACK_PACKET:
                cleanUp();
                reject(
                  new DeviceCommunicationError(
                    DeviceCommunicationErrorType.WRITE_ERROR,
                  ),
                );
                // eslint-disable-next-line
                return;
              default:
              // Do nothing
            }
          }
        }

        recheckTimeout = setTimeout(
          recheckAck,
          usableConfig.constants.RECHECK_TIME,
        );
      } catch (error) {
        cleanUp();
        reject(
          new DeviceCommunicationError(
            DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR,
          ),
        );
      }
    }

    connection
      .send(packet)
      .then(() => {
        recheckTimeout = setTimeout(
          recheckAck,
          usableConfig.constants.RECHECK_TIME,
        );
      })
      .catch(error => {
        cleanUp();
        logger.error(error);
        reject(
          new DeviceCommunicationError(
            DeviceCommunicationErrorType.WRITE_ERROR,
          ),
        );
      });

    timeout = setTimeout(() => {
      cleanUp();
      reject(
        new DeviceCommunicationError(
          DeviceCommunicationErrorType.WRITE_TIMEOUT,
        ),
      );
    }, usableConfig.constants.ACK_TIME);
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
  maxTries = 5,
) => {
  assert(connection, 'Invalid connection');
  assert(command, 'Invalid command');
  assert(data, 'Invalid data');
  assert(version, 'Invalid version');

  assert(command > 0, 'Command cannot be negative');
  assert(isHex(data), 'Index hex in data');
  assert(!maxTries || maxTries > 0, 'Max tries cannot be negative');

  if (![PacketVersionMap.v1, PacketVersionMap.v2].includes(version)) {
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

  const skipPacketIds: string[] = [];
  const packetsList = xmodemEncode(data, command, version);
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
      } catch (e) {
        // Don't retry if connection closed
        if (e instanceof DeviceConnectionError) {
          tries = localMaxTries;
        }

        if (!firstError) {
          firstError = e as Error;
        }
      }
      tries += 1;
    }

    if (!isDone) {
      if (firstError) {
        throw firstError;
      } else {
        throw new DeviceCommunicationError(
          DeviceCommunicationErrorType.WRITE_TIMEOUT,
        );
      }
    }
  }
};
