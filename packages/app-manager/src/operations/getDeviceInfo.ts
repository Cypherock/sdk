import { ISDK } from '@cypherock/sdk-core';
import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { Query, Result } from '../proto/generated/manager/core';
import { IGetDeviceInfoResponse } from '../proto/generated/types';

export const getDeviceInfo = async (
  sdk: ISDK,
): Promise<IGetDeviceInfoResponse> => {
  const sequenceNumber = sdk.getNewSequenceNumber();
  const query = Query.encode(Query.create({ getDeviceInfo: {} })).finish();

  await sdk.sendQuery({
    data: Uint8Array.from(query),
    sequenceNumber,
  });

  const data = await sdk.waitForResult({
    sequenceNumber,
  });

  let result: Result;
  try {
    result = Result.decode(data);
  } catch (error) {
    throw new DeviceAppError(DeviceAppErrorType.INVALID_RESULT);
  }

  if (!result.getDeviceInfo) {
    throw new DeviceAppError(DeviceAppErrorType.INVALID_RESULT);
  }

  return result.getDeviceInfo;
};
