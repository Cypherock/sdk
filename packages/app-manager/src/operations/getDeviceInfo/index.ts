import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { FirmwareVariant } from '../../proto/types';
import { firmwareVariantToJSON } from '../../proto/generated/common';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { IGetDeviceInfoResponse } from './types';

const logger = createLoggerWithPrefix(rootLogger, 'GetDeviceInfo');

export const getDeviceInfo = async (
  sdk: ISDK,
): Promise<IGetDeviceInfoResponse> => {
  logger.info('Started');
  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper(sdk, 'getDeviceInfo', 'getDeviceInfo');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  logger.verbose('GetDeviceInfoResponse', { result });
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');

  const variantId =
    result.result?.firmwareVariant ?? FirmwareVariant.MULTI_COIN;
  return {
    ...result.result,
    firmwareVariantInfo: {
      variantId,
      variantStr: firmwareVariantToJSON(variantId),
    },
  };
};
