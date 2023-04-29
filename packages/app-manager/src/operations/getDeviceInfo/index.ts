import { ISDK } from '@cypherock/sdk-core';
import { IGetDeviceInfoResultResponse } from '../../proto/generated/types';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';

export const getDeviceInfo = async (
  sdk: ISDK,
): Promise<IGetDeviceInfoResultResponse> => {
  const helper = new OperationHelper(sdk, 'getDeviceInfo', 'getDeviceInfo');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  return result.result;
};
