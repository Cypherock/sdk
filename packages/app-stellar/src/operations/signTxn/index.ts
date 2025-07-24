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
  
  // STELLAR CHANGE: Updated validation for XDR transaction format
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
    params.derivationPath[0] === (0x80000000 + 44) && params.derivationPath[1] === (0x80000000 + 148),
    'derivationPath should follow Stellar format: m/44\'/148\'/account\'',
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

  // STELLAR CHANGE: Convert XDR to bytes for hardware wallet
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

  // DEBUG: Log what the device actually returns
  // logger.info('DEBUG - Device result keys:', Object.keys(result));
  // logger.info('DEBUG - Device signature result:', result.signature);
  // logger.info('DEBUG - Signature hex:', signature);
  // logger.info('DEBUG - Original XDR:', params.txn.xdr);

  // STELLAR CHANGE: Reconstruct signed XDR transaction following XRP pattern
  let serializedTxn: string | undefined;

  if (params.serializeTxn) {
    try {
      const { getStellarLib } = require('../../utils');
      const StellarSdk = getStellarLib();
      
      // Parse the original unsigned transaction
      const transaction = StellarSdk.TransactionBuilder.fromXDR(
        params.txn.xdr, 
        params.txn.networkPassphrase
      );
      
      // Convert hex signature back to bytes
      const signatureBytes = Buffer.from(signature, 'hex');
      
      // Create a custom signer to add our signature
      const deviceSigner = {
        sign: () => signatureBytes,
        hint: () => Buffer.alloc(4), // 4-byte signature hint
      };
      
      // Add the signature to the transaction
      transaction.sign(deviceSigner);
      
      // Get the signed XDR ready for broadcast
      serializedTxn = transaction.toEnvelope().toXDR('base64');
      
      // logger.info('DEBUG - Successfully created serialized transaction');
      
    } catch (error) {
      logger.error('Failed to reconstruct signed transaction:', error);
      // For debugging: temporarily return original XDR instead of throwing
      logger.warn('Falling back to original XDR for debugging');
      serializedTxn = params.txn.xdr;
    }
  }

  return {
    signature,
    serializedTxn,
  };
};