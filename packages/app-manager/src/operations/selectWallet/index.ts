import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { ISelectWalletResultResponse } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'SelectWallet');

export const selectWallet = async (
  sdk: ISDK,
): Promise<ISelectWalletResultResponse> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper(sdk, 'selectWallet', 'selectWallet');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  logger.verbose('SelectWalletResponse', result);
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');
  return result.result;
};
