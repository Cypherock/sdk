import { ISDK } from '@cypherock/sdk-core';
import {
  createLoggerWithPrefix,
  createStatusListener,
  stringToVersion,
  uint8ArrayToHex,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  IFirmwareUpdateErrorResponse,
  FirmwareUpdateError,
  UpdateFirmwareStatus,
} from '../../proto/types';
import { firmwareService } from '../../services';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { UpdateFirmwareError, UpdateFirmwareErrorType } from './error';
import {
  createBootloaderSDK,
  handleLegacyDevice as takeLegacyDeviceToBootloaderMode,
  waitForReconnection,
} from './helpers';
import { IUpdateFirmwareParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'UpdateFirmware');

const parseFirmwareUpdateError = async (
  error?: IFirmwareUpdateErrorResponse,
) => {
  if (!error) return;

  const errorTypesMap: Record<FirmwareUpdateError, UpdateFirmwareErrorType> = {
    [FirmwareUpdateError.UNRECOGNIZED]: UpdateFirmwareErrorType.UNKNOWN_ERROR,
    [FirmwareUpdateError.FIRMWARE_UPDATE_ERROR_UNKNOWN]:
      UpdateFirmwareErrorType.UNKNOWN_ERROR,
    [FirmwareUpdateError.FIRMWARE_UPDATE_ERROR_VERSION_NOT_ALLOWED]:
      UpdateFirmwareErrorType.VERSION_NOT_ALLOWED,
  };

  throw new UpdateFirmwareError(errorTypesMap[error.error]);
};

export const updateFirmware = async (
  sdk: ISDK,
  params: IUpdateFirmwareParams,
): Promise<void> => {
  logger.info('Started');

  let { firmware, version } = params;
  const { onEvent } = params;

  const { forceStatusUpdate } = createStatusListener({
    enums: UpdateFirmwareStatus,
    onEvent,
    logger,
  });

  if (!firmware || !version) {
    logger.info('Fetching latest firmware version');

    const latestFirmware = await firmwareService.getLatest({
      prerelease: params.allowPrerelease,
      doDownload: true,
    });

    if (!latestFirmware.firmware) {
      throw new Error('No downloaded firmware found');
    }

    firmware = latestFirmware.firmware;
    version = stringToVersion(latestFirmware.version);
  }

  logger.info('Updating firmware', { version });

  const helper = new OperationHelper(sdk, 'firmwareUpdate', 'firmwareUpdate');

  if (!(await sdk.isInBootloader())) {
    if (await sdk.isSupported()) {
      await sdk.checkAppCompatibility(APP_VERSION);

      await helper.sendQuery({ initiate: { version } });
      const result = await helper.waitForResult();
      parseFirmwareUpdateError(result.error);
      logger.verbose('FirmwareUpdateConfirmedResponse', { result });
      assertOrThrowInvalidResult(result.confirmed);
    } else {
      await takeLegacyDeviceToBootloaderMode(sdk, version);
    }
  }

  forceStatusUpdate(UpdateFirmwareStatus.UPDATE_FIRMWARE_STATUS_USER_CONFIRMED);

  const bootloaderSdk = await createBootloaderSDK(
    sdk,
    params.getDevices,
    params.createConnection,
  );

  await bootloaderSdk.beforeOperation();
  await bootloaderSdk.sendBootloaderData(
    uint8ArrayToHex(firmware),
    params.onProgress,
  );
  await bootloaderSdk.destroy();

  try {
    await waitForReconnection(params.getDevices, params.createConnection);
  } catch (error) {
    logger.warn('Failed to reconnect to device');
    logger.warn(error);
  }

  logger.info('Completed');
};
