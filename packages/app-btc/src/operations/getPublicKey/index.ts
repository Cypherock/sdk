import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import {
  GetPublicKeyStatus,
  SeedGenerationStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
  configureAppId,
  assertDerivationPath,
} from '../../utils';
import {
  GetPublicKeyEvent,
  IGetPublicKeyParams,
  IGetPublicKeyResult,
} from './types';
import { getAddressFromPublicKey } from './publicKeyToAddress';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKey');

export const getPublicKey = async (
  sdk: ISDK,
  params: IGetPublicKeyParams,
): Promise<IGetPublicKeyResult> => {
  assert(params, 'Params should be defined');
  assert(params.derivationPath, 'DerivationPath should be defined');
  assert(params.walletId, 'WalletId should be defined');
  assert(
    params.derivationPath.length === 5,
    'DerivationPath should be of depth 5',
  );
  assertDerivationPath(params.derivationPath);

  await configureAppId(sdk, [params.derivationPath]);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: GetPublicKeyEvent,
    operationEnums: GetPublicKeyStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'getPublicKey',
    resultKey: 'getPublicKey',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
    },
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(GetPublicKeyEvent.VERIFY);

  const address = await getAddressFromPublicKey(
    result.result.publicKey,
    params.derivationPath,
  );

  return {
    publicKey: result.result.publicKey,
    address,
  };
};
