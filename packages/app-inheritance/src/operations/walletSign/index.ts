import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { IWalletAuthResultResponse } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'walletAuthRequest');

export const getWalletSign = async (
  sdk: ISDK,
): Promise<IWalletAuthResultResponse> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'walletAuth',
    resultKey: 'walletAuth',
  });
  // TODO: add vars to parameters
  await helper.sendQuery({
    initiate: {
      challenge: new Uint8Array([
        144, 213, 122, 213, 228, 193, 104, 222, 201, 19, 75, 27, 117, 55, 36,
        46, 163, 239, 183, 51, 61, 251, 171, 30, 87, 72, 90, 53, 41, 121, 48,
        132,
      ]),
      walletId: new Uint8Array([
        144, 213, 122, 213, 228, 193, 104, 222, 201, 19, 75, 27, 117, 55, 36,
        46, 87, 72, 90, 53, 41, 121, 48, 132, 163, 239, 183, 51, 61, 251, 171,
        30,
      ]),
      isPublickey: false,
    },
  });

  const result = await helper.waitForResult();
  logger.verbose('walletAuthResponse', result);
  console.log(JSON.stringify(result));
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');
  return result.result;
};
