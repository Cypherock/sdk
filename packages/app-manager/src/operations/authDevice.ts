import { ISDK } from '@cypherock/sdk-core';
import {
  assertOrThrowInvalidResult,
  decodeResult,
  encodeQuery,
} from '../utils';

export const authDevice = async (sdk: ISDK): Promise<boolean> => {
  await sdk.sendQuery(encodeQuery({ authDevice: { initiate: {} } }));

  let result = decodeResult(await sdk.waitForResult());
  assertOrThrowInvalidResult(result.authDevice?.serialSignature);

  const challenge = new Uint8Array([12]);

  await sdk.sendQuery(
    encodeQuery({ authDevice: { challenge: { challenge } } }),
  );

  result = decodeResult(await sdk.waitForResult());
  assertOrThrowInvalidResult(result.authDevice?.challengeSignature);

  await sdk.sendQuery(
    encodeQuery({ authDevice: { result: { verified: true } } }),
  );

  return true;
};
