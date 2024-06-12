import { ethers } from 'ethers';
import { encode } from 'bs58check';

export const getAddressFromPublicKey = (publicKey: string | Uint8Array) => {
  let publicKeyBytes;
  if (typeof publicKey === 'string') {
    publicKeyBytes = Uint8Array.from(
      Buffer.from(publicKey.replace(/^0x/, ''), 'hex'),
    );
  } else {
    publicKeyBytes = publicKey;
  }

  const trimmedPublicKeyBytes = publicKeyBytes.slice(1);
  const hash = ethers.keccak256(trimmedPublicKeyBytes);
  const hashBytes = Uint8Array.from(
    Buffer.from(hash.replace(/^0x/, ''), 'hex'),
  );
  const addressBytes = hashBytes.slice(-20);
  const extendedAddressBytes = new Uint8Array(addressBytes.length + 1);
  extendedAddressBytes[0] = 0x41;
  extendedAddressBytes.set(addressBytes, 1);
  const address = encode(extendedAddressBytes);

  return address;
};
