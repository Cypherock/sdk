import { ISDK } from '@cypherock/sdk-core';
import { assert } from '@cypherock/sdk-utils';
import { coinIdToAppIdMap } from '../constants/appId';

const getAppIdFromDerivationPaths = (derivationPaths: number[][]) => {
  const coinIds = derivationPaths.map(derivationPath => derivationPath[1]);
  const firstCoinId = coinIds[0];

  const isSame = coinIds.every(x => x === firstCoinId);
  assert(isSame, `Derivation paths must be for the same coin`);

  const appId = coinIdToAppIdMap[firstCoinId];
  assert(appId, `Coin ${firstCoinId.toString(16)} is not supported`);

  return appId;
};

export const configureAppId = (sdk: ISDK, derivationPaths: number[][]) => {
  const appId = getAppIdFromDerivationPaths(derivationPaths);
  sdk.configureAppletId(appId);
};
