import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { IGetWalletsResultResponse } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'GetWallets');

export const getWallets = async (
  sdk: ISDK,
): Promise<IGetWalletsResultResponse> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper(sdk, 'getWallets', 'getWallets');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  logger.verbose('GetWalletsResponse', result);
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');
  return result.result;
};
