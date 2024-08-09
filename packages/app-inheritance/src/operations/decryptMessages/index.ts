import { ISDK } from '@cypherock/sdk-core';
import { assert, createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { IDecryptMessagesParams, IDecryptMessagesResult } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'decryptMessages');

export const decryptMessages = async (
  sdk: ISDK,
  params: IDecryptMessagesParams,
): Promise<IDecryptMessagesResult> => {
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

  const parsedData = result.plainData.map(data => {
    if (params.getRawData) return data.message;
    return Buffer.from(data.message).toString();
  });

  logger.info('Completed');
  return { decryptedData: parsedData };
};
