import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  hexToUint8Array,
  uint8ArrayToHex,
} from '@cypherock/sdk-utils';
import { ethers } from 'ethers';
import { AddressFormat, SignTxnStatus } from '../../proto/generated/types';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { ISignTxnParams, ISignTxnResult } from './types';

export * from './types';

const CHUNK_SIZE = 5120;

const defaultParams = {
  addressFormat: AddressFormat.DEFAULT,
};

const splitTxnIntoChunks = (txn: Uint8Array): Uint8Array[] => {
  const chunks: Uint8Array[] = [];
  const totalChunks = Math.ceil(txn.length / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i += 1) {
    const chunk = txn.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE);
    chunks.push(chunk);
  }

  return chunks;
};

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

  let decodedTxn: ethers.Transaction;

  try {
    decodedTxn = ethers.Transaction.from(params.txn);
  } catch (error) {
    throw new Error('Invalid txn hex');
  }

  const { onStatus, forceStatusUpdate } = createStatusListener(
    SignTxnStatus,
    params.onEvent,
  );

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
      addressFormat: params.addressFormat ?? defaultParams.addressFormat,
      chainId: hexToUint8Array(decodedTxn.chainId.toString(16)),
    },
  });

  const txnBytes = hexToUint8Array(params.txn);
  const txnChunks = splitTxnIntoChunks(txnBytes);
  let remainingSize = txnBytes.length;

  for (let i = 0; i < txnChunks.length; i += 1) {
    const chunk = txnChunks[i];

    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.txnData);
    assertOrThrowInvalidResult(result.txnData.chunkIndex === i);

    forceStatusUpdate(SignTxnStatus.SIGN_TXN_STATUS_CONFIRM);

    remainingSize -= chunk.length;
    await helper.sendQuery({
      txnData: {
        txnChunk: chunk,
        chunkIndex: i,
        totalChunks: txnChunks.length,
        remainingSize,
      },
    });
  }

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnStatus.SIGN_TXN_STATUS_VERIFY);

  const signature = {
    r: `0x${uint8ArrayToHex(result.signature.r)}`,
    s: `0x${uint8ArrayToHex(result.signature.s)}`,
    v: `0x${uint8ArrayToHex(result.signature.v)}`,
  };

  let serializedTxn: string | undefined;

  if (params.serializeTxn) {
    decodedTxn.signature = ethers.Signature.from({
      ...signature,
      v: BigInt(signature.v),
    });
    serializedTxn = decodedTxn.serialized;
  }

  return {
    signature,
    serializedTxn,
  };
};
