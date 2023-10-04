import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import {
  GetXpubsStatus,
  IGetXpubsResultResponse,
  SeedGenerationStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
  configureAppId,
  assertDerivationPath,
} from '../../utils';
import { GetXpubsEvent, IGetXpubsParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'GetXpubs');

export const getXpubs = async (
  sdk: ISDK,
  params: IGetXpubsParams,
): Promise<IGetXpubsResultResponse> => {
  assert(params, 'Params should be defined');
  assert(params.derivationPaths, 'DerivationPaths should be defined');
  assert(params.walletId, 'WalletId should be defined');
  assert(
    params.derivationPaths.length > 0,
    'DerivationPaths should not be empty',
  );
  assert(
    params.derivationPaths.reduce(
      (acc, path) => acc && path.path.length === 3,
      true,
    ),
    'DerivationPaths should be of depth 3',
  );
  params.derivationPaths.forEach(item => assertDerivationPath(item.path));

  await configureAppId(
    sdk,
    params.derivationPaths.map(path => path.path),
  );

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: GetXpubsEvent,
    operationEnums: GetXpubsStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });
  const helper = new OperationHelper({
    sdk,
    queryKey: 'getXpubs',
    resultKey: 'getXpubs',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPaths: params.derivationPaths,
    },
  });

  let xpubs: string[] = [];
  const hasMore = () => xpubs.length !== params.derivationPaths.length;
  do {
    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.result);
    xpubs = [...xpubs, ...result.result.xpubs];
    forceStatusUpdate(GetXpubsEvent.PIN_CARD);
    if (hasMore()) {
      await helper.sendQuery({
        fetchNext: {},
      });
    }
  } while (hasMore());

  return {
    xpubs,
  };
};
