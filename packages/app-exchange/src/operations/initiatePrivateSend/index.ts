import { ISDK } from '@cypherock/sdk-core';
import { assert, createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { WALLET_ID_LENGTH } from '../../constants';
import { APP_VERSION } from '../../constants/appId';
import { OperationHelper, logger as rootLogger } from '../../utils';
import { IInitiatePrivateSendParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'InitiatePrivateSend');

export const initiatePrivateSend = async (
  sdk: ISDK,
  params: IInitiatePrivateSendParams,
): Promise<void> => {
  assert(params, 'Params should be defined');
  assert(params.from, 'from should be defined');
  assert(params.from.walletId, 'walletId should be defined');
  assert(params.from.appletId, 'appletId should be defined');
  assert(
    params.from.walletId.length === WALLET_ID_LENGTH,
    `Wallet Id should be exactly ${WALLET_ID_LENGTH} bytes`,
  );
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'initiateFlow',
    resultKey: 'initiateFlow',
  });

  await helper.sendQuery({
    initiatePrivateSend: {
      from: {
        appletId: params.from.appletId,
        walletId: params.from.walletId,
      },
    },
  });

  await helper.waitForResult();

  logger.info('Completed');
};
