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
  getCantonLib,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { ISignTxnParams, ISignTxnResult, SignTxnEvent } from './types';
import { getOrderedNodeIds } from './utils';

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

  const { cantonCoreLedgerProto } = getCantonLib();
  const {
    PreparedTransaction,
    DamlTransaction_Node: DamlTransactionNode,
    Metadata_InputContract: MetadataInputContract,
  } = cantonCoreLedgerProto;

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

  const preparedTransaction = PreparedTransaction.fromBinary(
    Buffer.from(params.txn.protoSerializedPreparedTransaction, 'base64'),
  );
  assert(preparedTransaction, 'preparedTransaction object is null');

  const { transaction, metadata } = preparedTransaction;

  assert(transaction, 'transaction object is null');
  assert(metadata, 'metadata object is null');

  // mapped node ids with their node objects
  // nodeId  => Node { nodeId, ... }
  const getNodesById = Object.fromEntries(
    transaction.nodes.map(n => [n.nodeId, n]),
  );

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
      version: transaction.version,
      roots: transaction.roots,
      nodeSeedsCount: transaction.nodeSeeds.length,
      nodesCount: transaction.nodes.length,
    },
  });
  const { txnMetaAccepted } = await helper.waitForResult();
  assertOrThrowInvalidResult(txnMetaAccepted);

  for (const nodeSeed of transaction.nodeSeeds) {
    await helper.sendQuery({
      txnNodeSeed: {
        nodeSeed,
      },
    });
    const { txnNodeSeedAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(txnNodeSeedAccepted);
  }

  // order nodes in the txn based on their dependencies
  const orderedNodeIds = getOrderedNodeIds(transaction.nodes);

  for (const nodeId of orderedNodeIds) {
    const node = getNodesById[nodeId];
    const serializedNode = DamlTransactionNode.toBinary(node);

    await helper.sendQuery({
      txnNodeMeta: {
        serializedDataSize: serializedNode.length,
      },
    });
    const { txnNodeMetaAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(txnNodeMetaAccepted);

    await helper.sendInChunks(serializedNode, 'txnNode', 'txnNodeAccepted');
  }

  // TODO: validate data types in metadata
  await helper.sendQuery({
    cantonMeta: {
      submitterInfo: metadata.submitterInfo,
      synchronizerId: metadata.synchronizerId,
      mediatorGroup: metadata.mediatorGroup,
      transactionUuid: metadata.transactionUuid,
      preparationTime: metadata.preparationTime.toString(),
      inputContractsCount: metadata.inputContracts.length,
      minLedgerEffectiveTime: metadata.minLedgerEffectiveTime?.toString(),
      maxLedgerEffectiveTime: metadata.maxLedgerEffectiveTime?.toString(),
    },
  });
  const { cantonMetaAccepted } = await helper.waitForResult();
  assertOrThrowInvalidResult(cantonMetaAccepted);

  for (const inputContract of metadata.inputContracts) {
    inputContract.eventBlob = Uint8Array.from([]);
    const serializedInputContract =
      MetadataInputContract.toBinary(inputContract);
    await helper.sendQuery({
      metaInputContractMeta: {
        serializedDataSize: serializedInputContract.length,
      },
    });
    const { metaInputContractMetaAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(metaInputContractMetaAccepted);

    await helper.sendInChunks(
      serializedInputContract,
      'metaInputContract',
      'metaInputContractAccepted',
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
