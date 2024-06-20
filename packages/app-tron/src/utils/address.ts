import { hexToUint8Array } from '@cypherock/sdk-utils';
import { getTronWeb } from './tronweb';

export const getAddressFromPublicKey = (publicKey: string | Uint8Array) => {
  const publicKeyBytes =
    typeof publicKey === 'string' ? hexToUint8Array(publicKey) : publicKey;

  const tronWeb = getTronWeb();

  const addressBytes = tronWeb.utils.crypto.computeAddress(publicKeyBytes);
  const address = tronWeb.address.fromHex(
    tronWeb.utils.code.byteArray2hexStr(addressBytes),
  );

  return address;
};
