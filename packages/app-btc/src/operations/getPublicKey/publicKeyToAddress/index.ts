import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import { assert } from '@cypherock/sdk-utils';
import type { Payment, PaymentOpts } from 'bitcoinjs-lib';
import {
  getBitcoinJsLib,
  getNetworkFromPath,
  getPurposeType,
  purposeType,
  SEGWIT_PURPOSE,
  NESTED_SEGWIT_PURPOSE,
} from '../../../utils';

const getPaymentsFunction = (path: number[]) => {
  const bitcoinJsLib = getBitcoinJsLib();
  const paymentFunctionMap: Record<
    purposeType,
    (a: Payment, opts?: PaymentOpts) => Payment
  > = {
    segwit: bitcoinJsLib.payments.p2wpkh,
    legacy: bitcoinJsLib.payments.p2pkh,
    nested_segwit: bitcoinJsLib.payments.p2sh,
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

  let redeem: Payment | undefined;
  if (path[0] === NESTED_SEGWIT_PURPOSE) {
    const segwitPaymentsFunction = getPaymentsFunction([SEGWIT_PURPOSE]);
    redeem = segwitPaymentsFunction({
      pubkey: Buffer.from(compressedPublicKey),
      network: getNetworkFromPath(path),
    });
  }

  const { address } = paymentsFunction({
    pubkey: !redeem ? Buffer.from(compressedPublicKey) : undefined,
    network: getNetworkFromPath(path),
    redeem,
  });

  assert(address, 'Could not derive address');

  return address;
};
