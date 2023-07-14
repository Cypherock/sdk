import { ISDK } from '@cypherock/sdk-core';
import {
  createLoggerWithPrefix,
  createStatusListener,
  hexToUint8Array,
  uint8ArrayToHex,
} from '@cypherock/sdk-utils';
import { SignTxnStatus } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { assertSignTxnParams } from './helpers';
import { ISignTxnParams, ISignTxnResult } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'SignTxn');

const signTxnDefaultParams = {
  version: 2,
  locktime: 0,
  hashtype: 1,
  input: {
    sequence: 0xffffffff,
  },
};

export const signTxn = async (
  sdk: ISDK,
  params: ISignTxnParams,
): Promise<ISignTxnResult> => {
  assertSignTxnParams(params);
  logger.info('Started');

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: SignTxnStatus,
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

  const { confirmation } = await helper.waitForResult();
  assertOrThrowInvalidResult(confirmation);
  forceStatusUpdate(SignTxnStatus.SIGN_TXN_STATUS_CONFIRM);

  await helper.sendQuery({
    meta: {
      version: signTxnDefaultParams.version,
      locktime: params.txn.locktime ?? signTxnDefaultParams.locktime,
      inputCount: params.txn.inputs.length,
      outputCount: params.txn.outputs.length,
      sighash: params.txn.hashType ?? signTxnDefaultParams.hashtype,
    },
  });
  const { metaAccepted } = await helper.waitForResult();
  assertOrThrowInvalidResult(metaAccepted);

  for (let i = 0; i < params.txn.inputs.length; i += 1) {
    const input = params.txn.inputs[i];
    await helper.sendQuery({
      input: {
        prevTxn: hexToUint8Array(input.prevTxn),
        prevTxnHash: hexToUint8Array(input.prevTxnHash),
        prevOutputIndex: input.prevIndex,
        scriptPubKey: hexToUint8Array(input.scriptPubKey),
        value: input.value,
        sequence: input.sequence ?? signTxnDefaultParams.input.sequence,
        changeIndex: input.chainIndex,
        addressIndex: input.addressIndex,
      },
    });
    const { inputAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(inputAccepted);
  }

  for (let i = 0; i < params.txn.outputs.length; i += 1) {
    const output = params.txn.outputs[i];
    await helper.sendQuery({
      output: {
        scriptPubKey: hexToUint8Array(output.scriptPubKey),
        value: output.value,
        isChange: output.isChange,
        changesIndex: output.chainIndex,
      },
    });
    const { outputAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(outputAccepted);
  }

  forceStatusUpdate(SignTxnStatus.SIGN_TXN_STATUS_VERIFY);

  const signatures: string[] = [];

  for (let i = 0; i < params.txn.inputs.length; i += 1) {
    await helper.sendQuery({
      signature: {
        index: i,
      },
    });

    const { signature } = await helper.waitForResult();
    assertOrThrowInvalidResult(signature);

    signatures.push(uint8ArrayToHex(signature.signature));
  }

  forceStatusUpdate(SignTxnStatus.SIGN_TXN_STATUS_CARD);

  logger.info('Completed');
  return { signatures };
};
