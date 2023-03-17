import { ISDK } from '@cypherock/sdk-core';
import { IGetWalletsResponse } from '../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  decodeResult,
  encodeQuery,
} from '../utils';

export const getWallets = async (sdk: ISDK): Promise<IGetWalletsResponse> => {
  await sdk.sendQuery(encodeQuery({ getWallets: {} }));

  const result = decodeResult(await sdk.waitForResult());
  assertOrThrowInvalidResult(result.getWallets);

  return result.getWallets;
};
