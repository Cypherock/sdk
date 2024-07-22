import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { IWalletAuthResultResponse } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { IWalletSignParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'walletAuthRequest');

export const getWalletSign = async (
  sdk: ISDK,
  params: IWalletSignParams,
): Promise<IWalletAuthResultResponse> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'walletAuth',
    resultKey: 'walletAuth',
  });

  await helper.sendQuery({
    initiate: params,
  });

  const result = await helper.waitForResult();
  logger.verbose('walletAuthResponse', result);
  console.log(JSON.stringify(result));
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');
  return result.result;
};
