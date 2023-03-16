import { ISDK } from '@cypherock/sdk-core';
import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { Query, Result } from '../proto/generated/manager/core';

export const getDeviceInfo = async (sdk: ISDK) => {
  const sequenceNumber = sdk.getNewSequenceNumber();
  const query = Query.encode(
    Query.create({ getDeviceInfo: { dummy: true } }),
  ).finish();

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
