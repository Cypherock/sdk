import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import {
  OperationHelper,
  assertOrThrowInvalidResult,
  derivePaymentAddress,
  deriveStakeAddress,
} from '../../utils';
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

  const publicKeys: { paymentKeys: Uint8Array[]; stakeKeys: Uint8Array[] } = {
    paymentKeys: [],
    stakeKeys: [],
  };
  const hasMore = () =>
    publicKeys.paymentKeys.length !== params.derivationPaths.length;
  do {
    const result = await helper.waitForResult();
    assertOrThrowInvalidResult(result.result);
    publicKeys.paymentKeys = [
      ...publicKeys.paymentKeys,
      ...result.result.paymentPubKeys,
    ];
    publicKeys.stakeKeys = [
      ...publicKeys.stakeKeys,
      ...result.result.stakePubKeys,
    ];
    forceStatusUpdate(GetPublicKeysEvent.PIN_CARD);
    if (hasMore()) {
      await helper.sendQuery({
        fetchNext: {},
      });
    }
  } while (hasMore());

  forceStatusUpdate(GetPublicKeysEvent.VERIFY);

  const addresses: { stake: string[]; payment: string[] } = {
    stake: [],
    payment: [],
  };
  for (let i = 0; i < publicKeys.paymentKeys.length; i += 1) {
    const stakeKey = publicKeys.stakeKeys[i];
    const paymentKey = publicKeys.paymentKeys[i];
    addresses.stake.push(deriveStakeAddress(stakeKey));
    addresses.payment.push(derivePaymentAddress(paymentKey, stakeKey));
  }

  return {
    publicKeys: {
      payment: publicKeys.paymentKeys.map(e => uint8ArrayToHex(e)),
      stake: publicKeys.stakeKeys.map(e => uint8ArrayToHex(e)),
    },
    addresses,
  };
};
