import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  uint8ArrayToHex,
  createLoggerWithPrefix,
  hexToUint8Array,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  SeedGenerationStatus,
  SignTxnExternalStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import {
  ISignTxnExternalParams,
  ISignTxnExternalResult,
  SignTxnExternalEvent,
} from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'SignTxnExternal');

export const signTxnExternal = async (
  sdk: ISDK,
  params: ISignTxnExternalParams,
): Promise<ISignTxnExternalResult> => {
  assert(params, 'Params should be defined');
  assert(params.walletId, 'walletId should be defined');
  assert(params.derivationPath, 'derivationPath should be defined');
  assert(
    params.derivationPath.length === 5,
    'derivationPath should be equal to 5',
  );
  assert(params.txn, 'txn should be defined');
  assert(typeof params.txn === 'object', 'txn should be an object');
  assert(
    typeof params.txn.txnSerializedHex === 'string',
    'txn.txnSerializedHex should be a string',
  );
  assert(params.txn.txnType, 'txn.txnType should be defined');

  await sdk.checkAppCompatibility(APP_VERSION);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: SignTxnExternalEvent,
    operationEnums: SignTxnExternalStatus,
    seedGenerationEnums: SeedGenerationStatus,
    onEvent: params.onEvent,
    logger,
  });

  const helper = new OperationHelper({
    sdk,
    queryKey: 'signTxnExternal',
    resultKey: 'signTxnExternal',
    onStatus,
  });

  const txnBytes = hexToUint8Array(params.txn.txnSerializedHex);

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
      txnType: params.txn.txnType,
      transactionSize: txnBytes.length,
    },
  });

  const { confirmation } = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmation);
  forceStatusUpdate(SignTxnExternalEvent.CONFIRM);

  await helper.sendInChunks(txnBytes, 'txnData', 'dataAccepted');

  await helper.sendQuery({
    signature: {},
  });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnExternalEvent.PIN_CARD);

  const signature = uint8ArrayToHex(result.signature.signature);

  return { signature };
};
