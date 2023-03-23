import { ISDK } from '@cypherock/sdk-core';
import { createStatusListener, assert } from '@cypherock/sdk-utils';
import {
  GetPublicKeyStatus,
  IGetPublicKeyResultResponse,
} from '../../proto/generated/types';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { IGetPublicKeyParams } from './types';

export * from './types';

export const getPublicKey = async (
  sdk: ISDK,
  params: IGetPublicKeyParams,
): Promise<IGetPublicKeyResultResponse> => {
  assert(params, 'Params should be defined');
  assert(params.derivationPath, 'DerivationPath should be defined');
  assert(params.walletId, 'WalletId should be defined');
  assert(params.derivationPath.length === 5, 'DerivationPath be of depth 5');

  const helper = new OperationHelper(sdk, 'getPublicKey', 'getPublicKey');

  const { onStatus, forceStatusUpdate } = createStatusListener(
    GetPublicKeyStatus,
    params.onEvent,
  );

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
    },
  });

  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(GetPublicKeyStatus.GET_PUBLIC_KEY_STATUS_VERIFY);

  return result.result;
};
