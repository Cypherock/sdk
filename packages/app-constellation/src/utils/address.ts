import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { getDag4Lib } from './dag4Lib';

export const getAddressFromPublicKey = (publicKey: string | Uint8Array) => {
  const publicKeyHex =
    typeof publicKey === 'string' ? publicKey : uint8ArrayToHex(publicKey);

  const { dag4 } = getDag4Lib();

  return dag4.keyStore.getDagAddressFromPublicKey(publicKeyHex);
};
