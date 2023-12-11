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
import { getLatestBlockHash } from '../../services/transaction';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
  getSolanaWeb3,
  base58Encode,
  base58Decode,
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
  assert(params.derivationPath, 'derivationPath should be defined');
  assert(
    params.derivationPath.length > 1,
    'derivationPath should be greater than 1',
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

  const txnBytes = hexToUint8Array(params.txn);

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

  await helper.sendInChunks(txnBytes, 'txnData', 'dataAccepted');

  await helper.sendQuery({
    verify: {},
  });
  const verifyResult = await helper.waitForResult();
  assertOrThrowInvalidResult(verifyResult.verify);

  const latestBlockHash = await (
    params.getLatestBlockHash ?? getLatestBlockHash
  )();
  const blockHashBuffer = base58Decode(latestBlockHash);

  await helper.sendQuery({
    signature: {
      blockhash: blockHashBuffer,
    },
  });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnEvent.PIN_CARD);

  const signature = uint8ArrayToHex(result.signature.signature);

  let serializedTxn: string | undefined;
  let serializedTxnHex: string | undefined;

  if (params.serializeTxn) {
    const solanaWeb3 = getSolanaWeb3();
    const transaction = solanaWeb3.Transaction.populate(
      solanaWeb3.Message.from(Buffer.from(params.txn, 'hex')),
    );
    if (latestBlockHash) transaction.recentBlockhash = latestBlockHash;
    assert(
      transaction.feePayer,
      new Error('Cannot decode feePayer in solana txn'),
    );
    transaction.addSignature(
      transaction.feePayer,
      Buffer.from(signature, 'hex'),
    );
    const serializedTxnBuffer = transaction.serialize();
    serializedTxnHex = uint8ArrayToHex(serializedTxnBuffer);
    serializedTxn = base58Encode(serializedTxnBuffer);
  }

  return {
    signature,
    serializedTxn,
    serializedTxnHex,
  };
};
