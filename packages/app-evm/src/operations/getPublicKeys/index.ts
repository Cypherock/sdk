import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import {
  GetPublicKeysStatus,
  SeedGenerationStatus,
} from '../../proto/generated/types';
import {
  OperationHelper,
  logger as rootLogger,
  configureAppId,
} from '../../utils';
import { runGetPublicKeysOnDevice } from '../runGetPublicKeys';
import {
  IGetPublicKeysParams,
  IGetPublicKeysResult,
  GetPublicKeysEvent,
} from '../types';

const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKeys');

export const getPublicKeys = async (
  sdk: ISDK,
  params: IGetPublicKeysParams,
): Promise<IGetPublicKeysResult> => {
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

  await configureAppId(sdk, params.chainId);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: GetPublicKeysEvent,
    operationEnums: GetPublicKeysStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'getPublicKeys',
    resultKey: 'getPublicKeys',
    onStatus,
  });

  return runGetPublicKeysOnDevice(helper, params, forceStatusUpdate);
};
