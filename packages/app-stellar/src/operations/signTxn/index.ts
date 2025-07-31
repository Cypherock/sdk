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
  getStellarLib,
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
    typeof params.txn.xdr === 'string',
    'txn.xdr should be a base64 XDR string',
  );
  assert(
    typeof params.txn.networkPassphrase === 'string',
    'txn.networkPassphrase should be a string',
  );

  assert(params.derivationPath, 'derivationPath should be defined');

  // Stellar uses 3-element derivation paths
  assert(
    params.derivationPath.length === 3,
    'derivationPath should have 3 elements for Stellar: [44, 148, account]',
  );

  // Validate Stellar derivation path format
  assert(
    params.derivationPath[0] === 0x80000000 + 44 &&
      params.derivationPath[1] === 0x80000000 + 148,
    "derivationPath should follow Stellar format: m/44'/148'/account'",
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
    // Convert base64 XDR to bytes
    txnBytes = Buffer.from(params.txn.xdr, 'base64');
  } catch (error) {
    throw new Error(`Invalid XDR transaction: ${error}`);
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

  // Send XDR bytes in chunks to hardware wallet
  await helper.sendInChunks(txnBytes, 'txnData', 'dataAccepted');

  await helper.sendQuery({
    signature: {},
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnEvent.PIN_CARD);

  const signature = uint8ArrayToHex(result.signature.signature);

  let serializedTxn: string | undefined;

  if (params.serializeTxn) {
    try {
      const StellarSdk = getStellarLib();

      const transaction = StellarSdk.TransactionBuilder.fromXDR(
        params.txn.xdr,
        params.txn.networkPassphrase,
      );

      const signatureBytes = Buffer.from(signature, 'hex');

      const hint = transaction.hash().slice(-4);
      const decoratedSignature = new StellarSdk.xdr.DecoratedSignature({
        hint,
        signature: signatureBytes,
      });

      transaction.signatures.push(decoratedSignature);

      serializedTxn = transaction.toEnvelope().toXDR('base64');
    } catch (error) {
      logger.error('Failed to reconstruct signed transaction:', error);
      throw error;
    }
  }

  return {
    signature,
    serializedTxn,
  };
};
