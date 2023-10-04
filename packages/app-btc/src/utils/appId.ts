import { ISDK } from '@cypherock/sdk-core';
import { assert } from '@cypherock/sdk-utils';
import { APP_VERSION, coinIndexToAppIdMap } from '../constants/appId';

const getAppIdFromDerivationPaths = (derivationPaths: number[][]) => {
  const coinIndexes = derivationPaths.map(derivationPath => derivationPath[1]);
  const firstCoinIndex = coinIndexes[0];

  const isSame = coinIndexes.every(x => x === firstCoinIndex);
  assert(isSame, `Derivation paths must be for the same coin`);

  const appId = coinIndexToAppIdMap[firstCoinIndex];
  assert(appId, `Coin ${firstCoinIndex.toString(16)} is not supported`);

  return appId;
};

export const configureAppId = async (
  sdk: ISDK,
  derivationPaths: number[][],
) => {
  const appId = getAppIdFromDerivationPaths(derivationPaths);
  sdk.configureAppletId(appId);
  await sdk.checkAppCompatibility(APP_VERSION);
};
