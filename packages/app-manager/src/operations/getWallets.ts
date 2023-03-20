import { ISDK } from '@cypherock/sdk-core';
import { IGetWalletsResponse } from '../proto/generated/types';
import { OperationHelper } from '../utils';

export const getWallets = async (sdk: ISDK): Promise<IGetWalletsResponse> => {
  const helper = new OperationHelper(sdk, 'getWallets', 'getWallets');

  await helper.sendQuery({});
  return helper.waitForResult();
};
