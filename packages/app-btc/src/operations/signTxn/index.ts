import { ISDK } from '@cypherock/sdk-core';
import {
  createLoggerWithPrefix,
  createStatusListener,
  hexToUint8Array,
  uint8ArrayToHex,
} from '@cypherock/sdk-utils';
import {
  SeedGenerationStatus,
  SignTxnStatus,
} from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
  getCoinTypeFromPath,
  configureAppId,
} from '../../utils';
import { getRawTxnHash } from '../../services/transaction';
import {
  addressToScriptPubKey,
  createSignedTransaction,
} from '../../utils/transaction';
import { assertSignTxnParams } from './helpers';
import { ISignTxnParams, ISignTxnResult, SignTxnEvent } from './types';

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

  await configureAppId(sdk, [params.derivationPath]);

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

  // duplicate locally and fill `prevTxn` if missing; we need completed inputs for preparing signed transaction
  const inputs = JSON.parse(JSON.stringify(params.txn.inputs));
  for (let i = 0; i < params.txn.inputs.length; i += 1) {
    const input = params.txn.inputs[i];
    // Device needs transaction hash which is reversed byte order of the transaction id
    const prevTxnHash = Buffer.from(input.prevTxnId, 'hex')
      .reverse()
      .toString('hex');
    const prevTxn =
      input.prevTxn ??
      (await getRawTxnHash({
        hash: input.prevTxnId,
        coinType: getCoinTypeFromPath(params.derivationPath),
      }));
    inputs[i].prevTxn = prevTxn;
    await helper.sendQuery({
      input: {
        prevTxn: hexToUint8Array(prevTxn),
        prevTxnHash: hexToUint8Array(prevTxnHash),
        prevOutputIndex: input.prevIndex,
        scriptPubKey: hexToUint8Array(
          addressToScriptPubKey(input.address, params.derivationPath),
        ),
        value: input.value,
        sequence: input.sequence ?? signTxnDefaultParams.input.sequence,
        changeIndex: input.changeIndex,
        addressIndex: input.addressIndex,
      },
    });
    const { inputAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(inputAccepted);
  }

  for (const output of params.txn.outputs) {
    await helper.sendQuery({
      output: {
        scriptPubKey: hexToUint8Array(
          addressToScriptPubKey(output.address, params.derivationPath),
        ),
        value: output.value,
        isChange: output.isChange,
        changesIndex: output.addressIndex,
      },
    });
    const { outputAccepted } = await helper.waitForResult();
    assertOrThrowInvalidResult(outputAccepted);
  }

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

  forceStatusUpdate(SignTxnEvent.PIN_CARD);
  const signedTransaction: string = createSignedTransaction({
    inputs,
    outputs: params.txn.outputs,
    signatures,
    derivationPath: params.derivationPath,
  });

  logger.info('Completed');
  return { signedTransaction, signatures };
};
