import { ISDK, SDK } from '@cypherock/sdk-core';
import {
  IDeviceConnection,
  DeviceState,
  DeviceConnectionError,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';
import { sleep } from '@cypherock/sdk-utils';
import { logger } from '../../utils';
import { CreateDeviceConnection } from './types';

const MAX_WAIT_TIME_TO_ENTER_BOOTLOADER = 3_000;
const MAX_WAIT_TIME_TO_RECONNECT_AFTER_UPDATE = 10_000;

const CONNECTION_RECHECK_TIME = 200;

const hasEnteredBootloaderMode = async (connection: IDeviceConnection) =>
  (await connection.getDeviceState()) === DeviceState.BOOTLOADER;

/**
 * Waits for the device to enter bootloader mode and returns a new SDK instance
 * that is connected to the device in bootloader mode.
 */
export const createBootloaderSDK = async (
  initialSdk: ISDK,
  createSerialportConnection: CreateDeviceConnection,
): Promise<ISDK> => {
  if (await initialSdk.isInBootloader()) return initialSdk;
  await initialSdk.destroy();
  logger.info('Waiting for device to enter bootloader mode');

  let connection: IDeviceConnection | undefined;

  const maxTries = Math.ceil(
    MAX_WAIT_TIME_TO_ENTER_BOOTLOADER / CONNECTION_RECHECK_TIME,
  );
  let tries = 0;

  while (tries < maxTries) {
    if (connection && (await hasEnteredBootloaderMode(connection))) break;

    await sleep(CONNECTION_RECHECK_TIME);

    try {
      connection = await createSerialportConnection();
      // eslint-disable-next-line no-empty
    } catch (error) {}

    tries += 1;
  }

  if (!connection || !(await hasEnteredBootloaderMode(connection))) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.CONNECTION_CLOSED,
    );
  }

  return SDK.create(connection, 0);
};

export const waitForReconnection = async (
  createConnection: CreateDeviceConnection,
): Promise<void> => {
  logger.info('Waiting for device to be reconnected after update');

  let connection: IDeviceConnection | undefined;

  const maxTries = Math.ceil(
    MAX_WAIT_TIME_TO_RECONNECT_AFTER_UPDATE / CONNECTION_RECHECK_TIME,
  );
  let tries = 0;

  while (tries < maxTries) {
    if (connection && !(await hasEnteredBootloaderMode(connection))) break;

    await sleep(CONNECTION_RECHECK_TIME);

    try {
      connection = await createConnection();
      // eslint-disable-next-line no-empty
    } catch (error) {}

    tries += 1;
  }

  if (!connection || (await hasEnteredBootloaderMode(connection))) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.CONNECTION_CLOSED,
    );
  }
};
