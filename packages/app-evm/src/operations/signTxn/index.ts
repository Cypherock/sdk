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

const defaultParams = {
  addressFormat: AddressFormat.DEFAULT,
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
  await helper.sendInChunks(txnBytes, 'txnData', 'txnData');
  forceStatusUpdate(SignTxnStatus.SIGN_TXN_STATUS_CONFIRM);

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnStatus.SIGN_TXN_STATUS_CARD);

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
