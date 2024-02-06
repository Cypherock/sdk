import {
  IDeviceConnection,
  DeviceConnectionError,
  DeviceConnectionErrorType,
  DeviceAppError,
  DeviceAppErrorType,
} from '@cypherock/sdk-interfaces';

import { DeviceIdleState } from '../../encoders/proto/generated/core';
import { PacketVersion, logger } from '../../utils';
import { getStatus } from './getStatus';
import * as config from '../../config';

export const waitForIdle = async ({
  connection,
  version,
  timeout,
}: {
  connection: IDeviceConnection;
  version: PacketVersion;
  timeout?: number;
}): Promise<void> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    try {
      logger.debug('Waiting for device to be idle');
      let isCompleted = false;

      const usableConfig = config.v3;
      let timeoutId: NodeJS.Timeout | undefined;
      let recheckTimeoutId: NodeJS.Timeout | undefined;

      const cleanUp = () => {
        isCompleted = true;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (recheckTimeoutId) {
          clearTimeout(recheckTimeoutId);
        }
      };

      const setRecheckTimeout = () => {
        if (isCompleted) return;

        if (recheckTimeoutId) {
          clearTimeout(recheckTimeoutId);
        }

        recheckTimeoutId = setTimeout(
          // eslint-disable-next-line no-use-before-define
          recheckIfIdle,
          usableConfig.constants.IDLE_RECHECK_TIME,
        );
      };

      // eslint-disable-next-line no-inner-declarations
      async function recheckIfIdle() {
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

          const status = await getStatus({
            connection,
            version,
            dontLog: true,
          });

          if (
            status.deviceIdleState !== DeviceIdleState.DEVICE_IDLE_STATE_USB
          ) {
            cleanUp();
            resolve();
            return;
          }

          setRecheckTimeout();
        } catch (error: any) {
          if (Object.values(DeviceConnectionErrorType).includes(error?.code)) {
            cleanUp();
            reject(error);
            return;
          }

          logger.error('Error while rechecking if idle');
          logger.error(error);
          setRecheckTimeout();
        }
      }

      timeoutId = setTimeout(async () => {
        cleanUp();

        if (!(await connection.isConnected())) {
          reject(
            new DeviceConnectionError(
              DeviceConnectionErrorType.CONNECTION_CLOSED,
            ),
          );
        } else {
          reject(
            new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND),
          );
        }
      }, timeout ?? usableConfig.constants.IDLE_TIMEOUT);

      setRecheckTimeout();
    } catch (error: any) {
      reject(error);
    }
  });
