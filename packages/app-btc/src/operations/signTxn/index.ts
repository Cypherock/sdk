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
  getBitcoinJsLib,
  getNetworkFromPath,
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

const addressToScriptPubKey = (address: string, derivationPath: number[]) => {
  const network = getNetworkFromPath(derivationPath);

  return getBitcoinJsLib()
    .address.toOutputScript(address, network)
    .toString('hex');
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
      inputSize: params.txn.inputs.length,
      outputSize: params.txn.inputs.length,
      hashType: params.txn.hashType ?? signTxnDefaultParams.hashtype,
    },
  });

  for (let i = 0; i < params.txn.inputs.length; i += 1) {
    const { input: inputRequest } = await helper.waitForResult();
    assertOrThrowInvalidResult(inputRequest);
    assertOrThrowInvalidResult(inputRequest.index === i);

    const input = params.txn.inputs[i];
    await helper.sendQuery({
      input: {
        prevTxn: hexToUint8Array(input.prevTxn),
        prevTxnHash: hexToUint8Array(input.prevTxnHash),
        prevIndex: input.prevIndex,
        scriptPubKey: hexToUint8Array(
          addressToScriptPubKey(input.address, params.derivationPath),
        ),
        value: input.value,
        sequence: input.sequence ?? signTxnDefaultParams.input.sequence,
        chainIndex: input.chainIndex,
        addressIndex: input.addressIndex,
      },
    });
  }

  for (let i = 0; i < params.txn.outputs.length; i += 1) {
    const { output: outputRequest } = await helper.waitForResult();
    assertOrThrowInvalidResult(outputRequest);
    assertOrThrowInvalidResult(outputRequest.index === i);

    const output = params.txn.outputs[i];
    await helper.sendQuery({
      output: {
        scriptPubKey: hexToUint8Array(
          addressToScriptPubKey(output.address, params.derivationPath),
        ),
        value: output.value,
        isChange: output.isChange,
        chainIndex: output.chainIndex,
        addressIndex: output.addressIndex,
      },
    });
  }

  const { verified } = await helper.waitForResult();
  assertOrThrowInvalidResult(verified);

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
