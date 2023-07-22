import { payments } from 'bitcoinjs-lib';
import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import { assert } from '@cypherock/sdk-utils';
import { getNetworkFromPath } from './networks';

const SEGWIT_PURPOSE = 0x80000054;
export const getAddressFromPublicKey = (
  uncompressedPublicKey: Uint8Array,
  path: number[],
) => {
  const publicKeyBuffer = Buffer.from(uncompressedPublicKey);
  const compressedPublicKey = ecc.pointCompress(publicKeyBuffer, true);

  const isSegwit = path[0] === SEGWIT_PURPOSE;

  const paymentsFunction = isSegwit ? payments.p2wpkh : payments.p2pkh;

  const { address } = paymentsFunction({
    pubkey: Buffer.from(compressedPublicKey),
    network: getNetworkFromPath(path),
  });

  assert(address, 'Could not derive address');

  return address;
};
