import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import type btcJsLib from 'bitcoinjs-lib';

export type bitcoinJsLibType = typeof btcJsLib;

let bitcoinJsLib: bitcoinJsLibType | undefined;

export const getBitcoinJsLib = () => {
  if (!bitcoinJsLib) {
    throw new Error('bitcoinjs-lib has not been set yet');
  }
  return bitcoinJsLib;
};

export const setBitcoinJSLib = (bitcoinJsLibrary: bitcoinJsLibType) => {
  bitcoinJsLib = bitcoinJsLibrary;
  bitcoinJsLib.initEccLib(ecc);
};
