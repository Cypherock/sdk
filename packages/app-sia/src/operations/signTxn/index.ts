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
  SignTxnStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { ISignTxnParams, ISignTxnResult, SignTxnEvent } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'SignTxn');

export const signTxn = async (
  sdk: ISDK,
  params: ISignTxnParams,
): Promise<ISignTxnResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.txn, 'txn should be defined');
  assert(typeof params.txn === 'object', 'txn should be an object');

  assert(
    typeof params.txn.blob === 'string',
    'txn.blob should be serialized SiaV2 transaction string',
  );

  assert(params.derivationPath, 'derivationPath should be defined');

  // Sia uses single element derivation paths
  assert(
    params.derivationPath.length === 1,
    'derivationPath should have exactly 1 element for Sia: [m | index]',
  );

  // Validate Sia derivation path format
  assert(
    params.derivationPath[0] >= 0,
    'index should be a non-negative integer in derivationPath [m | index] for Sia',
  );

  await sdk.checkAppCompatibility(APP_VERSION);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: SignTxnEvent,
    operationEnums: SignTxnStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'signTxn',
    resultKey: 'signTxn',
    onStatus,
  });

  let txnBytes: Uint8Array;

  try {
    // Convert blob to bytes
    txnBytes = Buffer.from(params.txn.blob, 'hex');
  } catch (error) {
    throw new Error(`Invalid SiaV2 transaction: ${error}`);
  }

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
      transactionSize: txnBytes.length,
    },
  });

  const { confirmation } = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmation);
  forceStatusUpdate(SignTxnEvent.CONFIRM);

  // Send blob bytes in chunks to hardware wallet
  await helper.sendInChunks(txnBytes, 'txnData', 'dataAccepted');

  await helper.sendQuery({
    signature: {},
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnEvent.PIN_CARD);

  const signature = uint8ArrayToHex(result.signature.signature);

  return {
    signature,
  };
};
