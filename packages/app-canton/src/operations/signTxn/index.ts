import { ISDK } from '@cypherock/sdk-core';
import {
  createStatusListener,
  assert,
  uint8ArrayToHex,
  createLoggerWithPrefix,
} from '@cypherock/sdk-utils';
import { type PreparedTransaction } from '@canton-network/wallet-sdk';
import { APP_VERSION } from '../../constants/appId';
import {
  SeedGenerationStatus,
  SignTxnStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  getCantonLib,
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
    typeof params.txn.protoSerializedPreparedTransaction === 'string',
    'txn.protoSerializedPreparedTransaction should be a string',
  );
  assert(params.derivationPath, 'derivationPath should be defined');
  assert(
    params.derivationPath.length === 5,
    'derivationPath should be equal to 5',
  );

  await sdk.checkAppCompatibility(APP_VERSION);
  const cantonLib = getCantonLib();
  const { decodePreparedTransaction } = cantonLib;

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

  const prepareTransaction: PreparedTransaction = decodePreparedTransaction(
    params.txn.protoSerializedPreparedTransaction,
  );

  assert(prepareTransaction.transaction, 'transaction object is null');
  assert(prepareTransaction.metadata, 'metadata object is null');

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPath: params.derivationPath,
    },
  });

  const { confirmation } = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmation);
  forceStatusUpdate(SignTxnEvent.CONFIRM);

  await helper.sendQuery({
    txnMeta: {
      version: prepareTransaction.transaction.version,
      roots: prepareTransaction.transaction.roots,
      nodeSeedsCount: prepareTransaction.transaction.nodeSeeds.length,
      nodesCount: prepareTransaction.transaction.nodes.length,
    },
  });
  const { txnMetaAccepted } = await helper.waitForResult();
  assertOrThrowInvalidResult(txnMetaAccepted);

  for (const nodeSeed of prepareTransaction.transaction.nodeSeeds) {
    await helper.sendQuery({
      txnNodeSeed: {
        nodeSeed,
      },
    });
    const { txnNodeSeedAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(txnNodeSeedAccepted);
  }

  for (const node of prepareTransaction.transaction.nodes) {
    // TODO: serialize node
    console.log('node', node);
    const serializedNode = new Uint8Array();
    await helper.sendInChunks(serializedNode, 'txnNode', 'txnNodeAccepted');
  }

  // TODO: validate data types in metadata
  await helper.sendQuery({
    cantonMeta: {
      submitterInfo: prepareTransaction.metadata.submitterInfo,
      synchronizerId: prepareTransaction.metadata.synchronizerId,
      mediatorGroup: prepareTransaction.metadata.mediatorGroup,
      transactionUuid: prepareTransaction.metadata.transactionUuid,
      preparationTime: prepareTransaction.metadata.preparationTime.toString(),
      inputContractsCount: prepareTransaction.metadata.inputContracts.length,
      globalKeyMappingCount:
        prepareTransaction.metadata.globalKeyMapping.length,
      minLedgerEffectiveTime:
        prepareTransaction.metadata.minLedgerEffectiveTime?.toString(),
      maxLedgerEffectiveTime:
        prepareTransaction.metadata.maxLedgerEffectiveTime?.toString(),
    },
  });
  const { cantonMetaAccepted } = await helper.waitForResult();
  assertOrThrowInvalidResult(cantonMetaAccepted);

  for (const inputContract of prepareTransaction.metadata.inputContracts) {
    console.log('inputContract', inputContract);
    // TODO: serialize input contract
    const serializedInputContract = new Uint8Array();
    await helper.sendInChunks(
      serializedInputContract,
      'metaInputContract',
      'metaInputContractAccepted',
    );
  }

  for (const globalKeyMappingEntry of prepareTransaction.metadata
    .globalKeyMapping) {
    console.log('globalKeyMappingEntry', globalKeyMappingEntry);
    // TODO: serialize global key mapping entry
    const serializedGlobalKeyMappingEntry = new Uint8Array();
    await helper.sendInChunks(
      serializedGlobalKeyMappingEntry,
      'metaGlobalKeyMappingEntry',
      'metaGlobalKeyMappingEntryAccepted',
    );
  }

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
