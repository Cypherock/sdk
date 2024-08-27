import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { IAuthWalletParams, AuthWalletEvent } from './types';
import { WALLET_ID_LENGTH } from '../../constants';
import { AuthWalletStatus, IAuthWalletResultResponse } from '../../types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'authWallet');

export const authWallet = async (
  sdk: ISDK,
  params: IAuthWalletParams,
): Promise<IAuthWalletResultResponse> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.challenge, 'challenge should be defined');
  assert(
    typeof params.isPublicKey === 'boolean',
    'isPublicKey should be defined',
  );
  assert(
    params.walletId.length === WALLET_ID_LENGTH,
    `Wallet Id should be exactly ${WALLET_ID_LENGTH} bytes`,
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  logger.info('Started', { ...params, onEvent: undefined });
  const { forceStatusUpdate, onStatus } = createStatusListener({
    enums: AuthWalletEvent,
    operationEnums: AuthWalletStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'authWallet',
    resultKey: 'authWallet',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      challenge: params.challenge,
      walletId: params.walletId,
      isPublicKey: params.isPublicKey,
      isSeedBased: params.isSeedBased,
    },
  });

  const result = await helper.waitForResult();
  logger.verbose('AuthWalletResponse', result);

  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(AuthWalletEvent.CARD_TAP);

  logger.info('Completed');
  return result.result;
};
