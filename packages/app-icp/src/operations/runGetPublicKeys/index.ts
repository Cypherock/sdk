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

  const verified = await helper.waitForResult();
  assertOrThrowInvalidResult(verified.verifyAccountId);

  forceStatusUpdate(GetPublicKeysEvent.ACCOUNT_ID_VERIFY);

  await helper.sendQuery({
    result: {},
  });

  let publicKeys: Uint8Array[] = [];
  const hasMore = () => publicKeys.length !== params.derivationPaths.length;
  do {
    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.result);
    publicKeys = [...publicKeys, ...result.result.publicKeys];

    if (hasMore()) {
      await helper.sendQuery({
        fetchNext: {},
      });
    }
  } while (hasMore());

  forceStatusUpdate(GetPublicKeysEvent.PRINCIPAL_ID_VERIFY);

  return {
    publicKeys: publicKeys.map(e => uint8ArrayToHex(e)),
  };
};
