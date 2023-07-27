import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import { assert } from '@cypherock/sdk-utils';
import type { Payment, PaymentOpts } from 'bitcoinjs-lib';
import {
  getBitcoinJsLib,
  getNetworkFromPath,
  getPurposeType,
  purposeType,
} from '../../../utils';

const getPaymentsFunction = (path: number[]) => {
  const bitcoinJsLib = getBitcoinJsLib();
  const paymentFunctionMap: Record<
    purposeType,
    (a: Payment, opts?: PaymentOpts) => Payment
  > = {
    segwit: bitcoinJsLib.payments.p2wpkh,
    legacy: bitcoinJsLib.payments.p2pkh,
  };
  const purpose = getPurposeType(path);
  return paymentFunctionMap[purpose];
};

export const getAddressFromPublicKey = async (
  uncompressedPublicKey: Uint8Array,
  path: number[],
) => {
  const compressedPublicKey = ecc.pointCompress(uncompressedPublicKey, true);

  const paymentsFunction = getPaymentsFunction(path);

  const { address } = paymentsFunction({
    pubkey: Buffer.from(compressedPublicKey),
    network: getNetworkFromPath(path),
  });

  assert(address, 'Could not derive address');

  return address;
};
