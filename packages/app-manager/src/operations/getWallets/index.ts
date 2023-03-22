import { ISDK } from '@cypherock/sdk-core';
import { IGetWalletsResultResponse } from '../../proto/generated/types';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';

export const getWallets = async (
  sdk: ISDK,
): Promise<IGetWalletsResultResponse> => {
  const helper = new OperationHelper(sdk, 'getWallets', 'getWallets');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  return result.result;
};
