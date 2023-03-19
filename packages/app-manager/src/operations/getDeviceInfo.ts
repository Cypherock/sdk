import { ISDK } from '@cypherock/sdk-core';
import { IGetDeviceInfoResponse } from '../proto/generated/types';
import { assertOrThrowInvalidResult, sendQuery, waitForResult } from '../utils';

export const getDeviceInfo = async (
  sdk: ISDK,
): Promise<IGetDeviceInfoResponse> => {
  await sendQuery(sdk, { getDeviceInfo: {} });

  const result = await waitForResult(sdk);
  assertOrThrowInvalidResult(result.getDeviceInfo);

  return result.getDeviceInfo;
};
