import { ISDK } from '@cypherock/sdk-core';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { IGroupSetupParams, IGroupSetupResult } from './types';

export * from './types';

export const groupSetup = async (
  sdk: ISDK,
  params: IGroupSetupParams,
): Promise<IGroupSetupResult> => {
  const helper = new OperationHelper(sdk, 'groupSetup', 'groupSetup');

  await helper.sendQuery({
    initiate: { walletId: params.walletId },
  });

  const { initiate } = await helper.waitForResult();
  assertOrThrowInvalidResult(initiate?.pubKey);

  params.onPublicKey?.(initiate.pubKey);

  await helper.sendQuery({
    getEntityInfo: {
      timestamp: Date.now(),
      threshold: params.threshold,
      totalParticipants: params.totalParticipants,
    },
  });

  const { getEntityInfo } = await helper.waitForResult();
  assertOrThrowInvalidResult(getEntityInfo?.entityInfo);

  const participantDetails = await params.onEntityInfo(
    getEntityInfo.entityInfo,
  );

  if (!participantDetails) {
    return {
      groupKeyInfo: { groupPubKey: new Uint8Array(), groupShare: undefined },
      signature: new Uint8Array(),
      completed: false,
    };
  }

  await helper.sendQuery({
    verifyParticipantInfoList: { participantInfoList: participantDetails },
  });

  const { verifyParticipantInfoList } = await helper.waitForResult();
  assertOrThrowInvalidResult(verifyParticipantInfoList?.verified);

  params.onVerification?.(verifyParticipantInfoList.verified);

  if (!verifyParticipantInfoList.verified) {
    return {
      groupKeyInfo: { groupPubKey: new Uint8Array(), groupShare: undefined },
      signature: new Uint8Array(),
      completed: false,
    };
  }

  await helper.sendQuery({
    getGroupId: {},
  });

  const { getGroupId } = await helper.waitForResult();
  assertOrThrowInvalidResult(getGroupId?.groupId);
  assertOrThrowInvalidResult(getGroupId?.signature);

  await params.onGroupID?.(getGroupId.groupId, getGroupId.signature);

  await helper.sendQuery({
    getShareData: {},
  });

  const { getShareData } = await helper.waitForResult();
  assertOrThrowInvalidResult(getShareData?.signedShareData);

  const signedShareDataList = await params.onShareData?.(
    getShareData.signedShareData,
  );

  if (!signedShareDataList) {
    return {
      groupKeyInfo: { groupPubKey: new Uint8Array(), groupShare: undefined },
      signature: new Uint8Array(),
      completed: false,
    };
  }

  await helper.sendQuery({
    getIndividualPublicKey: { shareDataList: signedShareDataList },
  });

  const { getIndividualPublicKey } = await helper.waitForResult();
  assertOrThrowInvalidResult(getIndividualPublicKey?.signedPubKey);

  const signedPubKeyList = await params.onIndividualPublicKey?.(
    getIndividualPublicKey.signedPubKey,
  );

  if (!signedPubKeyList) {
    return {
      groupKeyInfo: { groupPubKey: new Uint8Array(), groupShare: undefined },
      signature: new Uint8Array(),
      completed: false,
    };
  }

  await helper.sendQuery({
    getGroupPublicKey: { signedPubKeyList },
  });

  const { getGroupPublicKey } = await helper.waitForResult();
  assertOrThrowInvalidResult(getGroupPublicKey?.groupKey);
  assertOrThrowInvalidResult(getGroupPublicKey?.signature);

  return {
    groupKeyInfo: getGroupPublicKey.groupKey,
    signature: getGroupPublicKey.signature,
    completed: true,
  };
};
