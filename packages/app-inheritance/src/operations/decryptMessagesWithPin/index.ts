import { ISDK } from '@cypherock/sdk-core';
import { assert, createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import {
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
  assert(params.encryptedData, 'data should be defined');
  assert(
    params.encryptedData.length > 0,
    'At least one message required to decrypt',
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  logger.info('Started', { ...params, onEvent: undefined });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'recovery',
    resultKey: 'recovery',
  });

  await helper.sendQuery({
    encryptedData: {
      packet: params.encryptedData,
    },
  });

  const result = await helper.waitForResult();
  logger.verbose('decryptMessages response', result);

  assertOrThrowInvalidResult(result.plainData);
  logger.info('Completed');

  return {
    decryptedData: result.plainData.map(data => data.message),
    decryptedDataAsStrings: result.plainData.map(data =>
      Buffer.from(data.message).toString(),
    ),
  };
};
