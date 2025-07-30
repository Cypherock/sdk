import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { getStellarLib } from './stellarLib';

export const getAddressFromPublicKey = (
  publicKey: string | Uint8Array,
): string => {
  let hexKey: string;

  if (typeof publicKey === 'string') {
    hexKey = publicKey;
  } else {
    hexKey = uint8ArrayToHex(publicKey);
  }

  if (hexKey.startsWith('G') && hexKey.length === 56) {
    return hexKey;
  }

  try {
    const StellarSdk = getStellarLib();
    const pubKeyBytes = Buffer.from(hexKey, 'hex');

    // This directly returns the G... address - no need for keypair
    return StellarSdk.StrKey.encodeEd25519PublicKey(pubKeyBytes);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to derive Stellar address: ${error.message}`);
    } else {
      throw new Error('Failed to derive Stellar address: Unknown error');
    }
  }
};
