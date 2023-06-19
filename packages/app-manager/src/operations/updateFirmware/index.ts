import { ISDK } from '@cypherock/sdk-core';
import {
  createLoggerWithPrefix,
  stringToVersion,
  uint8ArrayToHex,
} from '@cypherock/sdk-utils';
import { firmwareService } from '../../services';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { createBootloaderSDK, waitForReconnection } from './helpers';
import { IUpdateFirmwareParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'UpdateFirmware');

export const updateFirmware = async (
  sdk: ISDK,
  params: IUpdateFirmwareParams,
): Promise<void> => {
  logger.info('Started');

  let { firmware, version } = params;

  if (!firmware || !version) {
    logger.info('Fetching latest firmware version');

    const latestFirmware = await firmwareService.getLatest({
      prerelease: params.allowPrerelease,
    });
    firmware = latestFirmware.firmware;
    version = stringToVersion(latestFirmware.version);
  }

  logger.info('Updating firmware', { version });

  const helper = new OperationHelper(sdk, 'firmwareUpdate', 'firmwareUpdate');

  if (!(await sdk.isInBootloader())) {
    await helper.sendQuery({ initiate: { version } });
    const result = await helper.waitForResult();
    logger.verbose('FirmwareUpdateConfirmedResponse', { result });
    assertOrThrowInvalidResult(result.confirmed);
  }

  const bootloaderSdk = await createBootloaderSDK(
    sdk,
    params.createSerialportConnection,
  );

  await bootloaderSdk.beforeOperation();
  await bootloaderSdk.sendBootloaderData(
    uint8ArrayToHex(firmware),
    params.onProgress,
  );
  await bootloaderSdk.destroy();

  try {
    await waitForReconnection(params.createConnection);
  } catch (error) {
    logger.warn('Failed to reconnect to device');
    logger.warn(error);
  }

  logger.info('Completed');
};
