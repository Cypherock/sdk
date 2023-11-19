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
import { ISignEntityInfoParams, ISignEntityInfoResult } from './types';

export * from './types';

// const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKey');

export const signEntityInfo = async (
  sdk: ISDK,
  params: ISignEntityInfoParams,
): Promise<ISignEntityInfoResult> => {
  assert(params, 'Params should be defined');
  assert(params.fingerprint, 'Fingerprint should be defined');
  assert(params.entityInfo, 'Entity Info should be defined');
  assert(
    params.fingerprint.length === 32,
    'Fingerprint should be of length 32',
  );

  const helper = new OperationHelper(sdk, 'signEntityInfo', 'signEntityInfo');

  await helper.sendQuery({
    initiate: {
      fingerprint: params.fingerprint,
      entityInfo: params.entityInfo,
    },
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  return {
    signature: result.result.signature,
  };
};
