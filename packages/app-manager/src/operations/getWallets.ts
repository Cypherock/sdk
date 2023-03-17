import { ISDK } from '@cypherock/sdk-core';
import { IGetWalletsResponse } from '../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  decodeResult,
  encodeQuery,
} from '../utils';

export const getWallets = async (sdk: ISDK): Promise<IGetWalletsResponse> => {
  const sequenceNumber = sdk.getNewSequenceNumber();

  await sdk.sendQuery({
    data: encodeQuery({ getWallets: {} }),
    sequenceNumber,
  });

  const result = decodeResult(
    await sdk.waitForResult({
      sequenceNumber,
    }),
  );
  assertOrThrowInvalidResult(result.getWallets);

  return result.getWallets;
};
