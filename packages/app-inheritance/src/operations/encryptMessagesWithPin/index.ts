import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { WALLET_ID_LENGTH } from '../../constants';
import { APP_VERSION } from '../../constants/appId';
import { EncryptDataStatus } from '../../types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import {
  EncryptMessagesWithPinEvent,
  IEncryptMessagesWithPinParams,
  IEncryptMessagesWithPinResult,
} from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'encryptMessages');

export const encryptMessageWithPin = async (
  sdk: ISDK,
  params: IEncryptMessagesWithPinParams,
): Promise<IEncryptMessagesWithPinResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.messages, 'messages should be defined');
  assert(
    params.walletId.length === WALLET_ID_LENGTH,
    `Wallet Id should be exactly ${WALLET_ID_LENGTH} bytes`,
  );
  params.messages.forEach(message =>
    assert(message.value, 'Every message should have a valid value'),
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  logger.info('Started', { ...params, onEvent: undefined });

  const { forceStatusUpdate, onStatus } = createStatusListener({
    enums: EncryptMessagesWithPinEvent,
    operationEnums: EncryptDataStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'encrypt',
    resultKey: 'encrypt',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      plainData: params.messages.map(message => ({
        message: Buffer.from(message.value),
        isVerifiedOnDevice: message.verifyOnDevice ?? false,
      })),
    },
  });

  const result = await helper.waitForResult();
  logger.verbose('encryptMessages response', result);

  assertOrThrowInvalidResult(result.result?.encryptedData);

  forceStatusUpdate(EncryptMessagesWithPinEvent.MESSAGE_ENCRYPTED);

  logger.info('Completed');
  return { encryptedPacket: result.result.encryptedData };
};
