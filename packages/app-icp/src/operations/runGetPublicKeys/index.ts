import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { OperationHelper, assertOrThrowInvalidResult } from '../../utils';
import { IGetPublicKeysParams, GetPublicKeysEvent } from './types';

export * from './types';

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
    publicKeys: publicKeys.map(e => uint8ArrayToHex(e)),
  };
};
