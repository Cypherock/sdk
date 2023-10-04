import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { IGetDeviceInfoResultResponse } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'GetDeviceInfo');

export const getDeviceInfo = async (
  sdk: ISDK,
): Promise<IGetDeviceInfoResultResponse> => {
  logger.info('Started');
  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper(sdk, 'getDeviceInfo', 'getDeviceInfo');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  logger.verbose('GetDeviceInfoResponse', { result });
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');
  return result.result;
};
