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

      const usableConfig = config.v3;
      let timeoutId: NodeJS.Timeout | undefined;
      let recheckTimeoutId: NodeJS.Timeout | undefined;

      const cleanUp = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (recheckTimeoutId) {
          clearTimeout(recheckTimeoutId);
        }
      };

      const recheckIfIdle = async () => {
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

          clearTimeout(recheckTimeoutId);
          recheckTimeoutId = setTimeout(
            recheckIfIdle,
            usableConfig.constants.RECHECK_TIME,
          );
        } catch (error: any) {
          if (Object.values(DeviceConnectionErrorType).includes(error?.code)) {
            cleanUp();
            reject(error);
            return;
          }

          logger.error('Error while rechecking if idle');
          logger.error(error);
          clearTimeout(recheckTimeoutId);
          recheckTimeoutId = setTimeout(
            recheckIfIdle,
            usableConfig.constants.RECHECK_TIME,
          );
        }
      };

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

      recheckTimeoutId = setTimeout(
        recheckIfIdle,
        usableConfig.constants.IDLE_RECHECK_TIME,
      );
    } catch (error: any) {
      reject(error);
    }
  });
