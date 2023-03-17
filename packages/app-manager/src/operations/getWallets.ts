import { ISDK } from '@cypherock/sdk-core';
import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { Query, Result } from '../proto/generated/manager/core';
import { IGetWalletsResponse } from '../proto/generated/types';

export const getWallets = async (sdk: ISDK): Promise<IGetWalletsResponse> => {
  const sequenceNumber = sdk.getNewSequenceNumber();
  const query = Query.encode(Query.create({ getWallets: {} })).finish();

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

  if (!result.getWallets) {
    throw new DeviceAppError(DeviceAppErrorType.INVALID_RESULT);
  }

  return result.getWallets;
};
