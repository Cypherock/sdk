import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  hexToUint8Array,
} from '@cypherock/sdk-utils';
import {
  AddressFormat,
  GetPublicKeysStatus,
  IGetPublicKeysResultResponse,
} from '../../proto/generated/types';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { IGetPublicKeysParams } from './types';

export * from './types';

const defaultParams = {
  format: AddressFormat.DEFAULT,
  doVerifyOnDevice: true,
};

export const getPublicKeys = async (
  sdk: ISDK,
  params: IGetPublicKeysParams,
): Promise<IGetPublicKeysResultResponse> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.chainId, 'chainId should be defined');
  assert(params.derivationPaths, 'derivationPaths should be defined');
  assert(
    params.derivationPaths.length > 0,
    'derivationPaths should not be empty',
  );
  assert(
    params.derivationPaths.reduce(
      (acc, path) => acc && path.path.length > 3,
      true,
    ),
    'derivationPaths should be greater than 3',
  );

  const { onStatus, forceStatusUpdate } = createStatusListener(
    GetPublicKeysStatus,
    params.onEvent,
  );

  const helper = new OperationHelper({
    sdk,
    queryKey: 'getPublicKeys',
    resultKey: 'getPublicKeys',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPaths: params.derivationPaths,
      chainId: hexToUint8Array(params.chainId.toString(16)),
      format: params.format ?? defaultParams.format,
      doVerify: params.doVerifyOnDevice ?? defaultParams.doVerifyOnDevice,
    },
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(GetPublicKeysStatus.GET_PUBLIC_KEYS_STATUS_VERIFY);

  return result.result;
};
