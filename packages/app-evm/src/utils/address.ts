import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { getEthersLib } from './ethers';

export const getAddressFromPublicKey = (publicKey: string | Uint8Array) => {
  const ethers = getEthersLib();

  let parsedPublicKey = '';

  if (typeof publicKey !== 'string') {
    parsedPublicKey = uint8ArrayToHex(publicKey);
  } else {
    parsedPublicKey = publicKey;
  }

  if (!parsedPublicKey.startsWith('0x')) {
    parsedPublicKey = `0x${parsedPublicKey}`;
  }

  let uncompressedPublicKey = ethers.SigningKey.computePublicKey(
    parsedPublicKey,
    false,
  ).slice(4);
  uncompressedPublicKey = `0x${uncompressedPublicKey}`;

  const address = ethers.keccak256(uncompressedPublicKey).slice(-40);

  return ethers.getAddress(`0x${address}`);
};
