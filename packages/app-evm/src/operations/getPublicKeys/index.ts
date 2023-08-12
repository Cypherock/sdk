import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import {
  AddressFormat,
  GetPublicKeysStatus,
  IGetPublicKeysResultResponse,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { IGetPublicKeysParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKeys');

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

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: GetPublicKeysStatus,
    onEvent: params.onEvent,
    logger,
  });

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
      chainId: params.chainId.toString(),
      format: params.format ?? defaultParams.format,
      doVerify: params.doVerifyOnDevice ?? defaultParams.doVerifyOnDevice,
    },
  });

  let publicKeys: Uint8Array[] = [];
  const hasMore = () => publicKeys.length !== params.derivationPaths.length;
  do {
    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.result);
    publicKeys = [...publicKeys, ...result.result.publicKeys];
    forceStatusUpdate(GetPublicKeysStatus.GET_PUBLIC_KEYS_STATUS_CARD);
    if (hasMore()) {
      await helper.sendQuery({
        fetchNext: {},
      });
    }
  } while (hasMore());

  return {
    publicKeys,
  };
};
