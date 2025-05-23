import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  GetPublicKeysStatus,
  SeedGenerationStatus,
} from '../../proto/generated/types';
import { runGetPublicKeysOnDevice } from '../runGetPublicKeys';
import { OperationHelper, logger as rootLogger } from '../../utils';
import { GetPublicKeysEvent } from '../types';
import {
  IGetUserVerifiedPublicKeyParams,
  IGetUserVerifiedPublicKeyResult,
} from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKeys');

export const getUserVerifiedPublicKey = async (
  sdk: ISDK,
  params: IGetUserVerifiedPublicKeyParams,
): Promise<IGetUserVerifiedPublicKeyResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.derivationPath, 'derivationPath should be defined');
  assert(
    params.derivationPath.length > 5,
    'derivationPath should be greater than 3',
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: GetPublicKeysEvent,
    operationEnums: GetPublicKeysStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'getUserVerifiedPublicKey',
    resultKey: 'getUserVerifiedPublicKey',
    onStatus,
  });

  const result = await runGetPublicKeysOnDevice(
    helper,
    {
      walletId: params.walletId,
      derivationPaths: [{ path: params.derivationPath }],
      onEvent: params.onEvent,
    },
    forceStatusUpdate,
  );

  return {
    publicKey: result.publicKeys[0],
  };
};
