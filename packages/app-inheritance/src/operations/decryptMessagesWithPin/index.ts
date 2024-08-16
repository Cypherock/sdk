import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { WALLET_ID_LENGTH } from '../../constants';
import { APP_VERSION } from '../../constants/appId';
import { DecryptDataStatus } from '../../types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import {
  DecryptMessagesWithPinEvent,
  IDecryptMessagesWithPinParams,
  IDecryptMessagesWithPinResult,
} from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'decryptMessages');

export const decryptMessagesWithPin = async (
  sdk: ISDK,
  params: IDecryptMessagesWithPinParams,
): Promise<IDecryptMessagesWithPinResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(
    params.walletId.length === WALLET_ID_LENGTH,
    `Wallet Id should be exactly ${WALLET_ID_LENGTH} bytes`,
  );
  assert(params.encryptedData, 'data should be defined');
  assert(
    params.encryptedData.length > 0,
    'At least one message required to decrypt',
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  logger.info('Started', { ...params, onEvent: undefined });

  const { forceStatusUpdate, onStatus } = createStatusListener({
    enums: DecryptMessagesWithPinEvent,
    operationEnums: DecryptDataStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'decrypt',
    resultKey: 'decrypt',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      encryptedData: params.encryptedData,
    },
  });

  const result = await helper.waitForResult();
  logger.verbose('decryptMessages response', result);

  assertOrThrowInvalidResult(result.messages?.plainData);

  const output = {
    decryptedData: result.messages.plainData.map(data => data.message),
    decryptedDataAsStrings: result.messages.plainData.map(data =>
      Buffer.from(data.message).toString(),
    ),
  };

  params.onDecryption?.(output);

  await helper.sendQuery({ ack: {} });

  await helper.waitForResult();

  forceStatusUpdate(DecryptMessagesWithPinEvent.PIN_VERIFIED);
  logger.info('Completed');
  return output;
};
