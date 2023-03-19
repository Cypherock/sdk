import { ISDK } from '@cypherock/sdk-core';
import { IGetWalletsResponse } from '../proto/generated/types';
import { assertOrThrowInvalidResult, sendQuery, waitForResult } from '../utils';

export const getWallets = async (sdk: ISDK): Promise<IGetWalletsResponse> => {
  await sendQuery(sdk, { getWallets: {} });

  const result = await waitForResult(sdk);
  assertOrThrowInvalidResult(result.getWallets);

  return result.getWallets;
};
