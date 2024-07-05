import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { GetChallengeResponse } from '../../proto/generated/inheritance/wallet_key';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'GetChallenge');

export const getWalletSign = async (
  sdk: ISDK,
): Promise<GetChallengeResponse> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'getChallenge',
    resultKey: 'getChallengeResponse',
  });

  await helper.sendQuery({ challenge: 'CHALLENGE #XX' });
  const result = await helper.waitForResult();
  logger.verbose('getChallengeResponse', result);
  assertOrThrowInvalidResult(result);

  logger.info('Completed');
  return result;
};
