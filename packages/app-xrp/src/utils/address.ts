import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { getXrpLib } from './xrpLib';

export const getAddressFromPublicKey = (publicKey: string | Uint8Array) => {
  const publicKeyHex =
    typeof publicKey === 'string' ? publicKey : uint8ArrayToHex(publicKey);

  const xrpl = getXrpLib();

  return xrpl.deriveAddress(publicKeyHex);
};
