import { ISDK } from '@cypherock/sdk-core';
import { assert } from '@cypherock/sdk-utils';
import { chainToAppIdMap } from '../constants/appId';

const getAppIdFromDerivationPaths = (chainId: number) => {
  const appId = chainToAppIdMap[chainId];
  assert(appId, `Coin 0x${chainId.toString(16)} is not supported`);

  return appId;
};

export const configureAppId = (sdk: ISDK, chainId: number) => {
  const appId = getAppIdFromDerivationPaths(chainId);
  sdk.configureAppletId(appId);
};
