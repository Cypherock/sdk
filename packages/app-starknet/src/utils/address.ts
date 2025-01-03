import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { getStarknetApiJs } from './starknetApiJs';

const contractAXclassHash =
  '0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003';

export const getAddressFromPublicKey = (publicKey: string | Uint8Array) => {
  const starknetjs = getStarknetApiJs();

  let parsedPublicKey = '';

  if (typeof publicKey !== 'string') {
    parsedPublicKey = uint8ArrayToHex(publicKey);
  } else {
    parsedPublicKey = publicKey;
  }

  if (!parsedPublicKey.startsWith('0x')) {
    parsedPublicKey = `0x${parsedPublicKey}`;
  }
  const constructorAXCallData = starknetjs.CallData.compile([
    parsedPublicKey,
    0,
  ]);
  const accountAXAddress = starknetjs.hash.calculateContractAddressFromHash(
    parsedPublicKey,
    contractAXclassHash,
    constructorAXCallData,
    0,
  );
  return starknetjs.getChecksumAddress(accountAXAddress);
};
