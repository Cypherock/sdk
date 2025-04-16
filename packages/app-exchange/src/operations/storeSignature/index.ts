import { ISDK } from '@cypherock/sdk-core';
import { assert, createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { IStoreSignatureResultResponse } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { IStoreSignatureParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'StoreSignature');

export const storeSignature = async (
  sdk: ISDK,
  params: IStoreSignatureParams,
): Promise<IStoreSignatureResultResponse> => {
  assert(params, 'Params should be defined');
  assert(params.signature?.length > 0, 'Signature should be valid');
  logger.info('Started');
  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'storeSignature',
    resultKey: 'storeSignature',
  });

  await helper.sendQuery({ initiate: { signature: params.signature } });
  const result = await helper.waitForResult();
  logger.verbose('StoreSignatureResponse', { result });
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');
  return result.result;
};
