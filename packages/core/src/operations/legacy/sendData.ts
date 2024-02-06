import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  IDeviceConnection,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import { assert, isHex } from '@cypherock/sdk-utils';

import * as config from '../../config';
import { PacketVersion, PacketVersionMap } from '../../utils';
import { xmodemEncode, xmodemDecode } from '../../encoders/packet/legacy';

/**
 * Writes the packet to the SerialPort on the given connection,
 * and rejects the promise if there is no acknowledgment from the device
 */
export const writePacket = (
  connection: IDeviceConnection,
  packet: Uint8Array,
  version: PacketVersion,
  skipPacketIds: string[],
  ackTimeout?: number,
) => {
  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

  /**
   * Be sure to remove all listeners and timeout.
   */
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!(await connection.isConnected())) {
        throw new DeviceConnectionError(
          DeviceConnectionErrorType.CONNECTION_CLOSED,
        );
      }

      let isCompleted = false;
      let timeout: NodeJS.Timeout | undefined;
      let recheckTimeout: NodeJS.Timeout | undefined;

      const cleanUp = () => {
        isCompleted = true;
        if (timeout) {
          clearTimeout(timeout);
        }
        if (recheckTimeout) {
          clearTimeout(recheckTimeout);
        }
      };

      const setRecheckTimeout = () => {
        if (isCompleted) return;

        if (recheckTimeout) {
          clearTimeout(recheckTimeout);
        }

        recheckTimeout = setTimeout(
          // eslint-disable-next-line no-use-before-define
          recheckAck,
          usableConfig.constants.RECHECK_TIME,
        );
      };

      // eslint-disable-next-line no-inner-declarations
      async function recheckAck() {
        try {
          if (!(await connection.isConnected())) {
            cleanUp();
            reject(
              new DeviceConnectionError(
                DeviceConnectionErrorType.CONNECTION_CLOSED,
              ),
            );
            return;
          }

          if (isCompleted) return;

          const pool = await connection.peek();

          for (const poolItem of pool) {
            const { data } = poolItem;
            if (skipPacketIds.includes(poolItem.id)) {
              // eslint-disable-next-line
              continue;
            }

            skipPacketIds.push(poolItem.id);

            const packetList = xmodemDecode(data, version);

            for (const pkt of packetList) {
              switch (pkt.commandType) {
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
                  return;
                default:
                // Do nothing
              }
            }
          }

          setRecheckTimeout();
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
          setRecheckTimeout();
        })
        .catch(() => {
          cleanUp();
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
      }, ackTimeout ?? usableConfig.constants.ACK_TIME);
    } catch (error) {
      reject(error);
    }
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
  maxTries?: number,
  timeout?: number,
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

  const innerMaxTries = maxTries ?? 5;

  const skipPacketIds: string[] = [];
  const packetsList = xmodemEncode(data, command, version);
  /**
   * Create a list of each packet and self contained retries and listener
   */
  // eslint-disable-next-line
  for (const packet of packetsList) {
    let tries = 1;
    let isDone = false;
    let localMaxTries = innerMaxTries;
    if (command === 255) localMaxTries = 1;

    let firstError: Error | undefined;
    while (!isDone && tries <= localMaxTries) {
      try {
        // eslint-disable-next-line
        await writePacket(connection, packet, version, skipPacketIds, timeout);
        isDone = true;
      } catch (e: any) {
        // Don't retry if connection closed
        if (Object.values(DeviceConnectionErrorType).includes(e?.code)) {
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
