import * as bip66 from 'bip66';
import type { Signer } from 'bitcoinjs-lib';

import { getBitcoinJsLib } from './bitcoinjs-lib';
import { getNetworkFromPath } from './networks';

import { ISignTxnInput, ISignTxnOutput } from '../operations/types';

export const addressToScriptPubKey = (
  address: string,
  derivationPath: number[],
) => {
  const network = getNetworkFromPath(derivationPath);

  const key = getBitcoinJsLib()
    .address.toOutputScript(address, network)
    .toString('hex');

  return key;
};

export function isScriptSegwit(script: string) {
  return script.startsWith('0014');
}

export const createSignedTransaction = (params: {
  inputs: ISignTxnInput[];
  outputs: ISignTxnOutput[];
  signatures: string[];
  derivationPath: number[];
}) => {
  const { inputs, outputs, signatures, derivationPath } = params;

  const bitcoinjs = getBitcoinJsLib();
  const transaction = new bitcoinjs.Psbt();

  for (let i = 0; i < inputs.length; i += 1) {
    const input = inputs[i];

    const script = addressToScriptPubKey(input.address, derivationPath);

    const isSegwit = isScriptSegwit(script);

    const txnInput: any = {
      hash: input.prevTxnHash,
      index: i,
    };

    if (isSegwit) {
      txnInput.witnessUtxo = {
        script: Buffer.from(script, 'hex'),
        value: parseInt(input.value, 10),
      };
    } else {
      txnInput.nonWitnessUtxo = Buffer.from(input.prevTxn, 'hex');
    }

    transaction.addInput(txnInput);
  }

  for (const output of outputs) {
    transaction.addOutput({
      address: output.address,
      value: parseInt(output.value, 10),
    });
  }

  for (let i = 0; i < inputs.length; i += 1) {
    const signature = signatures[i];

    const derLength = parseInt(signature.slice(4, 6), 16) * 2;
    const derEncoded = signature.slice(2, derLength + 6);
    const decoded = bip66.decode(Buffer.from(derEncoded, 'hex'));

    const signer: Signer = {
      publicKey: Buffer.from(signature.slice(signature.length - 66), 'hex'),
      sign: () => Buffer.concat([decoded.r, decoded.s]),
    };

    transaction.signInput(0, signer);
  }

  transaction.finalizeAllInputs();

  const hex = transaction.extractTransaction().toHex();

  return hex;
};
