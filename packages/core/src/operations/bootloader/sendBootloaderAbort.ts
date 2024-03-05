import {
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { hexToUint8Array, uint8ArrayToHex, assert } from '@cypherock/sdk-utils';

import * as config from '../../config';
import canRetry from '../helpers/canRetry';

const ACK_PACKET = '18';
/*
 * Resolves to an error msg returned from device or undefined if successful,
 * throws error if unable to send packet.
 */
const writePacket = (
  connection: IDeviceConnection,
  packet: Uint8Array,
  options?: { timeout?: number },
): Promise<Error | undefined> =>
  new Promise((resolve, reject) => {
    /**
     * Ensure is listener is activated first before writing
     */
    let timeout: NodeJS.Timeout | undefined;
    let recheckTimeout: NodeJS.Timeout | undefined;
    let isCompleted = false;

    function cleanUp() {
      isCompleted = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      if (recheckTimeout) {
        clearTimeout(recheckTimeout);
      }
    }

    const setRecheckTimeout = () => {
      if (isCompleted) return;

      if (recheckTimeout) {
        clearTimeout(recheckTimeout);
      }

      recheckTimeout = setTimeout(
        // eslint-disable-next-line no-use-before-define
        recheckPacket,
        config.v1.constants.RECHECK_TIME,
      );
    };

    async function recheckPacket() {
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

        const rawPacket = await connection.receive();
        if (!rawPacket) {
          setRecheckTimeout();
          return;
        }
        const ePacketData = uint8ArrayToHex(rawPacket);

        if (ePacketData.includes(ACK_PACKET)) {
          cleanUp();
          resolve(undefined);
          return;
        }

        setRecheckTimeout();
      } catch (error) {
        setRecheckTimeout();
      }
    }

    connection.send(packet).catch((err: Error) => {
      cleanUp();
      reject(err);
    });

    timeout = setTimeout(() => {
      cleanUp();
      reject(
        new DeviceCommunicationError(
          DeviceCommunicationErrorType.WRITE_TIMEOUT,
        ),
      );
    }, options?.timeout ?? 2000);

    setRecheckTimeout();
  });

export const sendBootloaderAbort = async (
  connection: IDeviceConnection,
  options?: {
    timeout?: number;
    firstTimeout?: number;
    maxTries?: number;
  },
) => {
  assert(connection, 'Invalid connection');

  const packetsList = ['41'];
  /**
   * Create a list of each packet and self contained retries and listener
   */
  const dataList = packetsList.map(
    (d, index) =>
      async (
        resolve: (val: boolean) => void,
        reject: (err?: Error) => void,
      ) => {
        let tries = 1;
        const innerMaxTries = options?.maxTries ?? 5;
        let firstError: Error | undefined;
        while (tries <= innerMaxTries) {
          try {
            const errorMsg = await writePacket(
              connection,
              hexToUint8Array(d),
              // Wait for 10 sec for the 1st packet ACK, there may be heavy processing task
              // in device after 1st packet.
              index === 0
                ? { timeout: options?.firstTimeout ?? 10000 }
                : { timeout: options?.timeout },
            );
            if (!errorMsg) {
              resolve(true);
            } else {
              reject(errorMsg);
            }
            return;
          } catch (e: any) {
            if (!canRetry(e)) {
              tries = innerMaxTries;
            }

            if (!firstError) {
              firstError = e as Error;
            }
          }
          tries += 1;
        }
        if (firstError) {
          reject(firstError);
        } else {
          reject(
            new DeviceCommunicationError(
              DeviceCommunicationErrorType.WRITE_ERROR,
            ),
          );
        }
      },
  );

  for (const j of dataList) {
    await new Promise((res, rej) => {
      j(res, rej);
    });
  }
};
