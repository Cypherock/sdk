import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { IWalletAuthResultResponse } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { IAuthWalletParams, WalletAuthEvent } from './types';
import { WalletAuthStatus } from '../../proto/generated/inheritance/wallet_auth';
import { WALLET_ID_LENGTH } from '../../constants';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'authWallet');

export const authWallet = async (
  sdk: ISDK,
  params: IAuthWalletParams,
): Promise<IWalletAuthResultResponse> => {
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
    enums: WalletAuthEvent,
    operationEnums: WalletAuthStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'walletAuth',
    resultKey: 'walletAuth',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      challenge: params.challenge,
      walletId: params.walletId,
      isPublickey: params.isPublicKey,
    },
  });

  const result = await helper.waitForResult();
  logger.verbose('WalletAuthResponse', result);

  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(WalletAuthEvent.CARD_TAP);

  logger.info('Completed');
  return result.result;
};
