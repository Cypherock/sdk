import base58 from 'bs58';

export const base58Encode = (val: Uint8Array) => base58.encode(val);

export const base58Decode = (val: string) => base58.decode(val);
