import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { WALLET_ID_LENGTH } from '../../constants';
import { APP_VERSION } from '../../constants/appId';
import {
  EncryptDataWithPinEncryptedDataStructure,
  EncryptDataWithPinPlainDataStructure,
} from '../../proto/generated/inheritance/encrypt_data_with_pin';
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
  Object.values(params.messages).forEach(message =>
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
    },
  });

  // Wait for confirmation
  await helper.waitForResult();

  const rawData = EncryptDataWithPinPlainDataStructure.encode(
    EncryptDataWithPinPlainDataStructure.create({
      data: Object.entries(params.messages).map(([key, message]) => ({
        message: Buffer.from(message.value),
        isVerifiedOnDevice: message.verifyOnDevice ?? false,
        tag: parseInt(key, 10),
      })),
    }),
  ).finish();
  await helper.sendInChunks(rawData, 'plainData', 'dataAccepted');

  const encryptedData = await helper.receiveInChunks(
    'encryptedDataRequest',
    'encryptedData',
  );
  const result = EncryptDataWithPinEncryptedDataStructure.decode(encryptedData);
  logger.verbose('encryptMessages response', result);

  assertOrThrowInvalidResult(result.encryptedData);

  forceStatusUpdate(EncryptMessagesWithPinEvent.MESSAGE_ENCRYPTED_CARD_TAP);

  logger.info('Completed');
  return { encryptedPacket: result.encryptedData };
};
