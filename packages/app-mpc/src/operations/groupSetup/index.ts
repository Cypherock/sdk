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
      groupId: new Uint8Array(),
      signature: new Uint8Array(),
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
      groupId: new Uint8Array(),
      signature: new Uint8Array(),
    };
  }

  await helper.sendQuery({
    getGroupId: {},
  });

  const { getGroupId } = await helper.waitForResult();
  assertOrThrowInvalidResult(getGroupId?.groupId);
  assertOrThrowInvalidResult(getGroupId?.signature);

  return {
    groupId: getGroupId.groupId,
    signature: getGroupId.signature,
  };
};
