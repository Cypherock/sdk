import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  hexToUint8Array,
  uint8ArrayToHex,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import {
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
} from '@cypherock/sdk-interfaces';
import type { Transaction } from 'ethers';
import {
  AddressFormat,
  SeedGenerationStatus,
  SignTxnStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
  getEthersLib,
  configureAppId,
} from '../../utils';
import { ISignTxnParams, ISignTxnResult, SignTxnEvent } from './types';
import { AppFeatures } from '../../constants/appId';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'SignTxn');

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

  const ethers = getEthersLib();

  let decodedTxn: Transaction;

  try {
    decodedTxn = ethers.Transaction.from(params.txn);
  } catch (error) {
    throw new Error('Invalid txn hex');
  }

  await configureAppId(sdk, Number(decodedTxn.chainId));

  // evm apps support eip2930/eip1559 transactions version 1.1.0 onwards
  if (decodedTxn.type === null) {
    logger.warn(`Transaction version is ${decodedTxn.type}.`);
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  } else if (decodedTxn.type === 1 || decodedTxn.type === 2) {
    await sdk.checkFeatureSupportCompatibility([AppFeatures.EIP_1559]);
  } else if (decodedTxn.type > 2) {
    logger.warn(
      `Transaction version ${decodedTxn.type} is not supported currently.`,
    );
    throw new DeviceCompatibilityError(
      DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
    );
  }

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
      addressFormat: params.addressFormat ?? defaultParams.addressFormat,
      chainId: decodedTxn.chainId.toString(),
      transactionSize: txnBytes.length,
    },
  });

  const { confirmation } = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmation);
  forceStatusUpdate(SignTxnEvent.CONFIRM);

  await helper.sendInChunks(txnBytes, 'txnData', 'dataAccepted');

  await helper.sendQuery({ signature: {} });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.signature);

  forceStatusUpdate(SignTxnEvent.PIN_CARD);

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
