import { ISDK } from '@cypherock/sdk-core';
import { IGetDeviceInfoResponse } from '../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  decodeResult,
  encodeQuery,
} from '../utils';

export const getDeviceInfo = async (
  sdk: ISDK,
): Promise<IGetDeviceInfoResponse> => {
  const sequenceNumber = sdk.getNewSequenceNumber();

  await sdk.sendQuery({
    data: encodeQuery({ getDeviceInfo: {} }),
    sequenceNumber,
  });

  const result = decodeResult(
    await sdk.waitForResult({
      sequenceNumber,
    }),
  );
  assertOrThrowInvalidResult(result.getDeviceInfo);

  return result.getDeviceInfo;
};
