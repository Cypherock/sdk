import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  hexToUint8Array,
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
  getNearApiJs,
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
  assert(params.derivationPath, 'derivationPaths should be defined');
  assert(
    params.derivationPath.length > 3,
    'derivationPath should be greater than 3',
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

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
    },
  });

  const confirmResponse = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmResponse.confirmation);
  forceStatusUpdate(SignTxnEvent.CONFIRM);

  const txnBytes = hexToUint8Array(params.txn);
  await helper.sendQuery({
    txn: {
      txn: txnBytes,
    },
  });

  const accepted = await helper.waitForResult();
  assertOrThrowInvalidResult(accepted.unsignedTxnAccepted);

  await helper.sendQuery({
    signature: {},
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnEvent.PIN_CARD);

  const signature = uint8ArrayToHex(result.signature.signature);

  const nearAPI = getNearApiJs();
  const transaction = nearAPI.transactions.Transaction.decode(
    Buffer.from(params.txn, 'hex'),
  );
  const stxn = new nearAPI.transactions.SignedTransaction({
    transaction,
    signature: new nearAPI.transactions.Signature({
      keyType: transaction.publicKey.keyType,
      data: result.signature.signature,
    }),
  });
  const serializedTxn = uint8ArrayToHex(stxn.encode());

  return {
    signature,
    serializedTxn,
  };
};
