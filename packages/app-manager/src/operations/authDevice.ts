import { ISDK } from '@cypherock/sdk-core';
import {
  assertOrThrowInvalidResult,
  decodeResult,
  encodeQuery,
} from '../utils';

export const authDevice = async (sdk: ISDK): Promise<boolean> => {
  let sequenceNumber = sdk.getNewSequenceNumber();

  await sdk.sendQuery({
    data: encodeQuery({ authDevice: { initiate: {} } }),
    sequenceNumber,
  });

  let result = decodeResult(
    await sdk.waitForResult({
      sequenceNumber,
    }),
  );
  assertOrThrowInvalidResult(result.authDevice?.serialSignature);

  const challenge = new Uint8Array([12]);

  sequenceNumber = sdk.getNewSequenceNumber();

  await sdk.sendQuery({
    data: encodeQuery({ authDevice: { challenge: { challenge } } }),
    sequenceNumber,
  });

  result = decodeResult(
    await sdk.waitForResult({
      sequenceNumber,
    }),
  );
  assertOrThrowInvalidResult(result.authDevice?.challengeSignature);

  await sdk.sendQuery({
    data: encodeQuery({ authDevice: { result: { verified: true } } }),
    sequenceNumber,
  });

  return true;
};
