import {
  DeviceError,
  DeviceErrorType,
  IDeviceConnection
} from '@cypherock/sdk-interfaces';
import { hexToUint8Array, logger, uint8ArrayToHex } from '../../utils';
import { stmXmodemEncode } from '../../encoders/packet/bootloader';
import * as config from '../../config';

const ACK_PACKET = '06';
const RECEIVING_MODE_PACKET = '43';

const ERROR_CODES = [
  {
    code: '07',
    errorObj: DeviceErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED
  },
  {
    code: '08',
    errorObj: DeviceErrorType.WRONG_HARDWARE_VERSION
  },
  {
    code: '09',
    errorObj: DeviceErrorType.LOWER_FIRMWARE_VERSION
  },
  {
    code: '0a',
    errorObj: DeviceErrorType.WRONG_MAGIC_NUMBER
  },
  {
    code: '0b',
    errorObj: DeviceErrorType.SIGNATURE_NOT_VERIFIED
  },
  {
    code: '0c',
    errorObj: DeviceErrorType.FLASH_WRITE_ERROR
  },
  {
    code: '0d',
    errorObj: DeviceErrorType.FLASH_CRC_MISMATCH
  },
  {
    code: '0e',
    errorObj: DeviceErrorType.FLASH_TIMEOUT_ERROR
  },
  {
    code: '15',
    errorObj: DeviceErrorType.FLASH_NACK
  }
];

/*
 * Resolves to an error msg returned from device or undefined if successful,
 * throws error if unable to send packet.
 */
const writePacket = (
  connection: IDeviceConnection,
  packet: Uint8Array,
  options?: { timeout?: number }
): Promise<DeviceError | undefined> =>
  new Promise((resolve, reject) => {
    /**
     * Ensure is listener is activated first before writing
     */
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

    if (!connection.isConnected()) {
      throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
    }

    async function recheckPacket() {
      try {
        if (!connection.isConnected()) {
          reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
          return;
        }

        const rawPacket = await connection.receive();
        if (!rawPacket) {
          recheckTimeout = setTimeout(
            recheckPacket,
            config.v1.constants.RECHECK_TIME
          );
          return;
        }

        const ePacketData = uint8ArrayToHex(rawPacket);

        // When a error code is received, return the error
        for (const error of ERROR_CODES) {
          if (ePacketData.includes(error.code)) {
            cleanUp();
            resolve(new DeviceError(error.errorObj));
            return;
          }
        }

        if (ePacketData.includes(ACK_PACKET)) {
          cleanUp();
          resolve(undefined);
          return;
        }

        recheckTimeout = setTimeout(
          recheckPacket,
          config.v1.constants.RECHECK_TIME
        );
      } catch (error) {
        logger.error('Error while processing data from device');
        logger.error(error);
        recheckTimeout = setTimeout(
          recheckPacket,
          config.v1.constants.RECHECK_TIME
        );
      }
    }

    connection.send(packet).catch(err => {
      cleanUp();
      reject(err);
    });

    timeout = setTimeout(() => {
      cleanUp();
      reject(new DeviceError(DeviceErrorType.WRITE_TIMEOUT));
    }, options?.timeout || 2000);

    recheckTimeout = setTimeout(
      recheckPacket,
      config.v1.constants.RECHECK_TIME
    );
  });

const checkIfInReceivingMode = async (
  connection: IDeviceConnection,
  options?: { timeout?: number }
) =>
  new Promise((resolve, reject) => {
    /**
     * Ensure is listener is activated first before writing
     */
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

    if (!connection.isConnected()) {
      throw new DeviceError(DeviceErrorType.CONNECTION_CLOSED);
    }

    async function recheckPacket() {
      try {
        if (!connection.isConnected()) {
          reject(new DeviceError(DeviceErrorType.CONNECTION_CLOSED));
          return;
        }
        const rawPacket = await connection.receive();
        if (!rawPacket) {
          recheckTimeout = setTimeout(
            recheckPacket,
            config.v1.constants.RECHECK_TIME
          );
          return;
        }

        const ePacketData = uint8ArrayToHex(rawPacket);

        if (ePacketData.includes(RECEIVING_MODE_PACKET)) {
          cleanUp();
          resolve(undefined);
          return;
        }

        recheckTimeout = setTimeout(
          recheckPacket,
          config.v1.constants.RECHECK_TIME
        );
      } catch (error) {
        logger.error('Error while processing data from device');
        logger.error(error);
        recheckTimeout = setTimeout(
          recheckPacket,
          config.v1.constants.RECHECK_TIME
        );
      }
    }

    timeout = setTimeout(() => {
      cleanUp();
      reject(new DeviceError(DeviceErrorType.NOT_IN_RECEIVING_MODE));
    }, options?.timeout || 2000);

    recheckTimeout = setTimeout(
      recheckPacket,
      config.v1.constants.RECHECK_TIME
    );
  });

export const stmUpdateSendData = async (
  connection: IDeviceConnection,
  data: string,
  onProgress?: (percent: number) => void
) => {
  const packetsList = stmXmodemEncode(data);

  try {
    await checkIfInReceivingMode(connection);
  } catch (error) {
    logger.error(error);
    throw error;
  }

  /**
   * Create a list of each packet and self contained retries and listener
   */
  const dataList = packetsList.map(
    (d, index) => async (resolve: any, reject: any) => {
      let tries = 1;
      const innerMaxTries = 5;
      let firstError: Error | undefined;
      while (tries <= innerMaxTries) {
        try {
          const errorMsg = await writePacket(
            connection,
            hexToUint8Array(d),
            // Wait for 10 sec for the 1st packet ACK, there may be heavy processing task
            // in device after 1st packet.
            index === 0 ? { timeout: 10000 } : undefined
          );
          if (!errorMsg) {
            if (onProgress) {
              onProgress((index * 100) / packetsList.length);
            }
            resolve(true);
          } else {
            reject(errorMsg);
          }
          return;
        } catch (e) {
          if (e instanceof DeviceError) {
            if (
              [
                DeviceErrorType.CONNECTION_CLOSED,
                DeviceErrorType.CONNECTION_NOT_OPEN,
                DeviceErrorType.NOT_CONNECTED
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
        reject(firstError);
      } else {
        reject(new DeviceError(DeviceErrorType.WRITE_ERROR));
      }
    }
  );

  for (const j of dataList) {
    try {
      await new Promise((res, rej) => {
        j(res, rej);
      });
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
};
