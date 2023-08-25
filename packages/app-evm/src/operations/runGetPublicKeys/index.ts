import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { AddressFormat } from '../../proto/generated/types';
import {
  OperationHelper,
  assertOrThrowInvalidResult,
  getAddressFromPublicKey,
} from '../../utils';
import { IGetPublicKeysParams, GetPublicKeysEvent } from './types';

export * from './types';

const defaultParams = {
  format: AddressFormat.DEFAULT,
  doVerifyOnDevice: true,
};

export const runGetPublicKeysOnDevice = async (
  helper:
    | OperationHelper<'getPublicKeys', 'getPublicKeys'>
    | OperationHelper<'getUserVerifiedPublicKey', 'getUserVerifiedPublicKey'>,
  params: IGetPublicKeysParams,
  forceStatusUpdate: (flowStatus: number) => void,
) => {
  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPaths: params.derivationPaths,
      chainId: params.chainId.toString(),
      format: params.format ?? defaultParams.format,
      doVerify: params.doVerifyOnDevice ?? defaultParams.doVerifyOnDevice,
    },
  });

  let publicKeys: Uint8Array[] = [];
  const hasMore = () => publicKeys.length !== params.derivationPaths.length;
  do {
    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.result);
    publicKeys = [...publicKeys, ...result.result.publicKeys];
    forceStatusUpdate(GetPublicKeysEvent.PIN_CARD);
    if (hasMore()) {
      await helper.sendQuery({
        fetchNext: {},
      });
    }
  } while (hasMore());

  forceStatusUpdate(GetPublicKeysEvent.VERIFY);

  return {
    publicKeys: publicKeys.map(e => `0x${uint8ArrayToHex(e)}`),
    addresses: publicKeys.map(e => getAddressFromPublicKey(e)),
  };
};
