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
import { IVerifyEntityInfoParams, IVerifyEntityInfoResult } from './types';

export * from './types';

// const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKey');

export const verifyEntityInfo = async (
  sdk: ISDK,
  params: IVerifyEntityInfoParams,
): Promise<IVerifyEntityInfoResult> => {
  assert(params, 'Params should be defined');
  assert(params.fingerprint, 'Fingerprint should be defined');
  assert(params.entityInfo, 'Entity Info should be defined');
  assert(params.signature, 'Signature should be defined');
  assert(
    params.fingerprint.length === 32,
    'Fingerprint should be of length 32',
  );
  assert(params.signature.length === 64, 'Signature should be of length 64');

  const helper = new OperationHelper(
    sdk,
    'verifyEntityInfo',
    'verifyEntityInfo',
  );

  await helper.sendQuery({
    initiate: {
      fingerprint: params.fingerprint,
      entityInfo: params.entityInfo,
      signature: params.signature,
    },
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  return {
    verified: result.result.verified,
  };
};
