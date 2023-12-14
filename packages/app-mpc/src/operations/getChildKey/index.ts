import { ISDK } from '@cypherock/sdk-core';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { IGetChildKeyParams, IGetChildKeyResult } from './types';

export * from './types';

export const getChildKey = async (
  sdk: ISDK,
  params: IGetChildKeyParams,
): Promise<IGetChildKeyResult> => {
  const helper = new OperationHelper(sdk, 'getChildKey', 'getChildKey');

  await helper.sendQuery({
    initiate: { walletId: params.walletId },
  });

  const { initiate } = await helper.waitForResult();
  assertOrThrowInvalidResult(initiate?.pubKey);

  await helper.sendQuery({
    getChildPublicKey: {
      groupKeyInfo: params.groupKeyInfo,
      signature: params.signature,
      derivationPath: params.path,
    },
  });

  const { getChildPublicKey } = await helper.waitForResult();
  assertOrThrowInvalidResult(getChildPublicKey?.publicKey);

  return {
    pubKey: getChildPublicKey.publicKey,
  };
};
