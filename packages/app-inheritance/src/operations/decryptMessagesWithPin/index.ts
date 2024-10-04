import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { WALLET_ID_LENGTH } from '../../constants';
import { APP_VERSION } from '../../constants/appId';
import {
  DecryptDataWithPinDecryptedDataStructure,
  DecryptDataWithPinEncryptedDataStructure,
} from '../../proto/generated/inheritance/decrypt_data_with_pin';
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
    },
  });

  await helper.waitForResult();
  logger.verbose('decryptMessages confirmed');

  const rawData = DecryptDataWithPinEncryptedDataStructure.encode(
    DecryptDataWithPinEncryptedDataStructure.create({
      data: params.encryptedData,
    }),
  ).finish();
  await helper.sendInChunks(rawData, 'encryptedData', 'dataAccepted');

  const decryptedData = await helper.receiveInChunks(
    'decryptedDataRequest',
    'decryptedData',
  );
  const result = DecryptDataWithPinDecryptedDataStructure.decode(decryptedData);
  logger.verbose('decryptMessages response', result);

  assertOrThrowInvalidResult(result.decryptedData);

  const output: IDecryptMessagesWithPinResult = {};

  for (const data of result.decryptedData) {
    output[data.tag] = {
      data: data.message,
      dataAsString: Buffer.from(data.message).toString(),
    };
  }

  forceStatusUpdate(DecryptMessagesWithPinEvent.PIN_VERIFIED);
  logger.info('Completed');
  return output;
};
