import * as bip66 from 'bip66';
import { Signer, payments, networks } from 'bitcoinjs-lib';

import { assert } from '@cypherock/sdk-utils';
import { getBitcoinJsLib } from './bitcoinjs-lib';
import { getNetworkFromPath } from './networks';

import { ISignTxnInputData, ISignTxnOutputData } from '../operations/types';

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

export function isScriptNestedSegwit(script: string) {
  return (
    script.toLowerCase().startsWith('a914') &&
    script.endsWith('87') &&
    script.length === 46
  );
}

export const createSignedTransaction = (params: {
  inputs: ISignTxnInputData[];
  outputs: ISignTxnOutputData[];
  signatures: string[];
  derivationPath: number[];
}) => {
  const { inputs, outputs, signatures, derivationPath } = params;

  const bitcoinjs = getBitcoinJsLib();
  const transaction = new bitcoinjs.Psbt({
    network: getNetworkFromPath(derivationPath),
  });

  let inputIndex = 0;
  for (const input of inputs) {
    const script = addressToScriptPubKey(input.address, derivationPath);

    const isNestedSegwit = isScriptNestedSegwit(script);
    const isSegwit = isScriptSegwit(script) || isNestedSegwit;

    const txnInput: any = {
      hash: input.prevTxnId,
      index: input.prevIndex,
    };

    if (isSegwit) {
      txnInput.witnessUtxo = {
        script: Buffer.from(script, 'hex'),
        value: parseInt(input.value, 10),
      };
      if (isNestedSegwit) {
        const publickey = Buffer.from(
          signatures[inputIndex].slice(signatures[0].length - 66),
          'hex',
        );
        txnInput.redeemScript = payments.p2wpkh({
          pubkey: publickey,
          network: networks.bitcoin,
        }).output;
      }
    } else {
      assert(input.prevTxn, 'prevTxn is required in input');
      txnInput.nonWitnessUtxo = Buffer.from(input.prevTxn, 'hex');
    }

    transaction.addInput(txnInput);
    inputIndex += 1;
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
      sign: () => {
        let rValue =
          decoded.r.length > 32
            ? decoded.r.subarray(decoded.r.length - 32, 33)
            : decoded.r;
        let sValue =
          decoded.s.length > 32
            ? decoded.s.subarray(decoded.s.length - 32, 33)
            : decoded.s;

        if (rValue.length !== 32) {
          rValue = Buffer.concat([Buffer.alloc(32 - rValue.length), rValue]);
        }

        if (sValue.length !== 32) {
          sValue = Buffer.concat([Buffer.alloc(32 - sValue.length), sValue]);
        }

        return Buffer.concat([rValue, sValue]);
      },
    };

    transaction.signInput(i, signer);
  }

  transaction.finalizeAllInputs();

  const hex = transaction.extractTransaction(true).toHex();

  return hex;
};
