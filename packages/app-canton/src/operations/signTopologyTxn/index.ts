import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  uint8ArrayToHex,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  SeedGenerationStatus,
  SignTopologyTxnStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import {
  ISignTopologyTxnParams,
  ISignTopologyTxnResult,
  SignTopologyTxnEvent,
} from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'SignTopologyTxn');

export const signTopologyTxn = async (
  sdk: ISDK,
  params: ISignTopologyTxnParams,
): Promise<ISignTopologyTxnResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.derivationPath, 'derivationPath should be defined');
  assert(
    params.derivationPath.length === 5,
    'derivationPath should be equal to 5',
  );
  assert(params.topologyTxn, 'topologyTxn should be defined');
  assert(
    typeof params.topologyTxn === 'object',
    'topologyTxn should be an object',
  );
  assert(
    params.topologyTxn.partyTransactions,
    'topologyTxn.partyTransactions should be defined',
  );
  assert(
    params.topologyTxn.partyTransactions.length === 3,
    'topologyTxn.partyTransactions length should be equal to 3',
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: SignTopologyTxnEvent,
    operationEnums: SignTopologyTxnStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'signTopologyTxn',
    resultKey: 'signTopologyTxn',
    onStatus,
  });

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
    },
  });

  const { confirmation } = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmation);
  forceStatusUpdate(SignTopologyTxnEvent.CONFIRM);

  for (const txn of params.topologyTxn.partyTransactions) {
    await helper.sendQuery({
      txnData: {
        serializedTxn: txn,
      },
    });
    const { dataAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(dataAccepted);
  }

  await helper.sendQuery({
    signature: {},
  });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTopologyTxnEvent.PIN_CARD);

  const signature = uint8ArrayToHex(result.signature.signature);

  return { signature };
};
