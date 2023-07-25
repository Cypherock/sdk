import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import { assert } from '@cypherock/sdk-utils';
import { getNetworkFromPath } from './networks';

const getBitcoin = async () => {
  let btcLib = await import('../../../../scripts/bitcoinjs-lib');
  try {
    if (typeof window === 'undefined') btcLib = await import('bitcoinjs-lib');
  } catch (e) {
    console.log(e);
  }

  return btcLib;
};

const SEGWIT_PURPOSE = 0x80000054;
export const getAddressFromPublicKey = async (
  uncompressedPublicKey: Uint8Array,
  path: number[],
) => {
  const publicKeyBuffer = Buffer.from(uncompressedPublicKey);
  const compressedPublicKey = ecc.pointCompress(publicKeyBuffer, true);

  const isSegwit = path[0] === SEGWIT_PURPOSE;

  const Bitcoin: any = await getBitcoin();

  const paymentsFunction = isSegwit
    ? Bitcoin.payments.p2wpkh
    : Bitcoin.payments.p2pkh;

  const { address } = paymentsFunction({
    pubkey: Buffer.from(compressedPublicKey),
    network: getNetworkFromPath(path),
  });

  assert(address, 'Could not derive address');

  return address;
};
