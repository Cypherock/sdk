import base58 from 'bs58';

export const generateAddressFromPublicKey = (publicKey: Uint8Array) =>
  base58.encode(publicKey);
