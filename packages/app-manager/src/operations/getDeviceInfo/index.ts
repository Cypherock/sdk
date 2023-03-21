import { ISDK } from '@cypherock/sdk-core';
import { IGetDeviceInfoResponse } from '../../proto/generated/types';
import { OperationHelper } from '../../utils';

export const getDeviceInfo = async (
  sdk: ISDK,
): Promise<IGetDeviceInfoResponse> => {
  const helper = new OperationHelper(sdk, 'getDeviceInfo', 'getDeviceInfo');

  await helper.sendQuery({});
  return helper.waitForResult();
};
