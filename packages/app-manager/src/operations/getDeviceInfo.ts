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
  await sdk.sendQuery(encodeQuery({ getDeviceInfo: {} }));

  const result = decodeResult(await sdk.waitForResult());
  assertOrThrowInvalidResult(result.getDeviceInfo);

  return result.getDeviceInfo;
};
