import { ISDK, SDK } from '@cypherock/sdk-core';
import {
  IDeviceConnection,
  DeviceState,
  DeviceConnectionError,
  DeviceConnectionErrorType,
  IDevice,
} from '@cypherock/sdk-interfaces';
import { sleep } from '@cypherock/sdk-utils';
import { logger } from '../../../utils';
import { GetDevices, CreateDeviceConnection } from '../types';

const MAX_WAIT_TIME_TO_ENTER_BOOTLOADER = 3_000;
const MAX_WAIT_TIME_TO_RECONNECT_AFTER_UPDATE = 10_000;

const CONNECTION_RECHECK_TIME = 200;

const waitForDeviceToBeConnected = async (params: {
  getDevices: GetDevices;
  createConnection: CreateDeviceConnection;
  inBootloader: boolean;
  maxTries: number;
  recheckTime: number;
  dontConnect?: boolean;
}): Promise<IDeviceConnection | undefined> => {
  const {
    getDevices,
    createConnection,
    inBootloader,
    maxTries,
    recheckTime,
    dontConnect,
  } = params;

  let tries = 0;
  let connection: IDeviceConnection | undefined;
  let isConnected = false;

  while (tries < maxTries) {
    const devices = await getDevices();

    const device: IDevice | undefined = devices.filter(d =>
      inBootloader
        ? d.deviceState === DeviceState.BOOTLOADER
        : d.deviceState !== DeviceState.BOOTLOADER,
    )[0];

    if (device) {
      try {
        if (!dontConnect) {
          connection = await createConnection(device);
        }
        isConnected = true;
      } catch (error) {
        logger.error('Error while creating connection');
        logger.error(error);
      }
    }

    if (isConnected) break;

    tries += 1;
    await sleep(recheckTime);
  }

  if (!isConnected) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.CONNECTION_CLOSED,
    );
  }

  return connection;
};

/**
 * Waits for the device to enter bootloader mode and returns a new SDK instance
 * that is connected to the device in bootloader mode.
 */
export const createBootloaderSDK = async (
  initialSdk: ISDK,
  getDevices: GetDevices,
  createConnection: CreateDeviceConnection,
): Promise<ISDK> => {
  if (await initialSdk.isInBootloader()) return initialSdk;
  await initialSdk.destroy();
  logger.info('Waiting for device to enter bootloader mode');

  const maxTries = Math.ceil(
    MAX_WAIT_TIME_TO_ENTER_BOOTLOADER / CONNECTION_RECHECK_TIME,
  );

  const connection = await waitForDeviceToBeConnected({
    createConnection,
    getDevices,
    inBootloader: true,
    maxTries,
    recheckTime: CONNECTION_RECHECK_TIME,
  });

  if (!connection) {
    throw new DeviceConnectionError(
      DeviceConnectionErrorType.CONNECTION_CLOSED,
    );
  }

  return SDK.create(connection, 0);
};

export const waitForReconnection = async (
  getDevices: GetDevices,
  createConnection: CreateDeviceConnection,
): Promise<void> => {
  logger.info('Waiting for device to be reconnected after update');

  const maxTries = Math.ceil(
    MAX_WAIT_TIME_TO_RECONNECT_AFTER_UPDATE / CONNECTION_RECHECK_TIME,
  );

  await waitForDeviceToBeConnected({
    createConnection,
    getDevices,
    inBootloader: false,
    maxTries,
    recheckTime: CONNECTION_RECHECK_TIME,
    dontConnect: true,
  });

  logger.info('Device reconnected after update');
};
