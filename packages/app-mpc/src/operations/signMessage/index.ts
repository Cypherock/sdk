import { ISDK } from '@cypherock/sdk-core';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import {
  ISignMessageParams,
  ISignMessageResult,
  SignedGroupKeyInfo,
} from './types';
import {
  GroupInfo,
  GroupKeyInfo,
  SignedPublicKey,
  SignedShareData,
} from '../../proto/generated/mpc_poc/common';

export * from './types';

export const signMessage = async (
  sdk: ISDK,
  params: ISignMessageParams,
): Promise<ISignMessageResult> => {
  const helper = new OperationHelper(sdk, 'signMessage', 'signMessage');

  await helper.sendQuery({
    initiate: { walletId: params.walletId },
  });

  const { initiate } = await helper.waitForResult();
  assertOrThrowInvalidResult(initiate?.pubKey);

  await helper.sendQuery({
    approveMessage: {
      msg: params.msg,
      groupId: params.groupID,
    },
  });

  const { approveMessage } = await helper.waitForResult();
  assertOrThrowInvalidResult(approveMessage?.approved);

  await params.onMessageApproval();

  const groupData: {
    groupInfo: GroupInfo;
    groupInfoSignature: Uint8Array;
    groupKeyInfo: GroupKeyInfo;
    groupKeyInfoSignature: Uint8Array;
  } = await params.getGroupInfo();

  await helper.sendQuery({
    postGroupInfo: {
      groupInfo: groupData.groupInfo,
      groupInfoSig: groupData.groupInfoSignature,
      groupKeyInfo: groupData.groupKeyInfo,
      groupKeyInfoSig: groupData.groupKeyInfoSignature,
    },
  });

  const { postGroupInfo } = await helper.waitForResult();
  assertOrThrowInvalidResult(postGroupInfo?.success);

  const sequenceIndices = await params.getSequenceIndices();

  await helper.sendQuery({
    postSequenceIndices: {
      sequenceIndices,
    },
  });

  const { postSequenceIndices } = await helper.waitForResult();
  assertOrThrowInvalidResult(postSequenceIndices?.success);

  let polynomialCount = 0;
  const shareDataList: SignedShareData[] = [];

  while (true) {
    await helper.sendQuery({
      getShareData: {},
    });

    const { getShareData } = await helper.waitForResult();
    assertOrThrowInvalidResult(getShareData?.signedShareData);

    shareDataList.push(getShareData.signedShareData);
    polynomialCount += 1;

    if (!getShareData.hasMore) {
      break;
    }
  }

  const shareDataListList = await params.onShareDataList(shareDataList);
  const signedPubKeyList: SignedPublicKey[] = [];

  for (let i = 0; i < polynomialCount; i += 1) {
    const signedShareDataList = shareDataListList[i];

    await helper.sendQuery({
      getQI: {
        shareDataList: signedShareDataList,
      },
    });

    const { getQI } = await helper.waitForResult();
    assertOrThrowInvalidResult(getQI?.signedPubKey);

    signedPubKeyList.push(getQI.signedPubKey);
  }

  const signedPubKeyListList =
    await params.onSignedPubKeyList(signedPubKeyList);

  const groupKeyInfoList: SignedGroupKeyInfo[] = [];

  for (let i = 0; i < polynomialCount; i += 1) {
    const signedPublicKeyList = signedPubKeyListList[i];

    await helper.sendQuery({
      getGroupKey: {
        signedPubKeyList: signedPublicKeyList,
      },
    });

    const { getGroupKey } = await helper.waitForResult();
    assertOrThrowInvalidResult(getGroupKey?.groupKey);
    assertOrThrowInvalidResult(getGroupKey?.signature);

    groupKeyInfoList.push({
      groupKeyInfo: getGroupKey.groupKey,
      signature: getGroupKey.signature,
    });
  }

  await params.onGroupKeyList(groupKeyInfoList);

  await helper.sendQuery({
    startMta: {},
  });

  const { startMta } = await helper.waitForResult();
  console.log(startMta?.receiverTimes);
  console.log(startMta?.senderTimes);

  return {
    success: true,
  };
};
