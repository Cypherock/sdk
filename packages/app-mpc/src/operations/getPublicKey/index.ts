import { ISDK } from '@cypherock/sdk-core';
import {
  assert,
  // createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  // logger as rootLogger,
} from '../../utils';
import { IGetPublicKeyParams, IGetPublicKeyResult } from './types';

export * from './types';

// const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKey');

export const getPublicKey = async (
  sdk: ISDK,
  params: IGetPublicKeyParams,
): Promise<IGetPublicKeyResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'Wallet ID should be defined');
  assert(params.walletId.length === 32, 'Wallet ID should be of length 32');

  const helper = new OperationHelper(sdk, 'getPublicKey', 'getPublicKey');

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
    },
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  return {
    pubKey: result.result.pubKey,
  };
};
