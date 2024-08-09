import { ISDK } from '@cypherock/sdk-core';
import { assert, createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import {
  IEncryptMessagesParams,
  IEncryptMessagesResult,
  WALLET_ID_LENGTH,
} from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'encryptMessages');

export const encryptMessages = async (
  sdk: ISDK,
  params: IEncryptMessagesParams,
): Promise<IEncryptMessagesResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.messages, 'messages should be defined');
  assert(
    params.walletId.length === WALLET_ID_LENGTH,
    `Wallet Id should be exactly ${WALLET_ID_LENGTH} bytes`,
  );
  assert(
    params.messages.length > 0,
    'At least one message required to encrypt',
  );
  params.messages.forEach(message =>
    assert(message.value, 'Every message should have a valid value'),
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  logger.info('Started', { ...params, onEvent: undefined });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'setup',
    resultKey: 'setup',
  });

  await helper.sendQuery({
    walletId: params.walletId,
    plainData: params.messages.map(message => ({
      message: Buffer.from(message.value),
      isPrivate: message.isPrivate ?? false,
    })),
  });

  const result = await helper.waitForResult();
  logger.verbose('encryptMessages response', result);

  assertOrThrowInvalidResult(result.encryptedData);

  logger.info('Completed');
  return { encryptedPacket: result.encryptedData.packet };
};
