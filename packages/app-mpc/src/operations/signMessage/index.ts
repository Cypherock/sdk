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
  assertOrThrowInvalidResult(postSequenceIndices?.myIndex);

  const { myIndex } = postSequenceIndices;

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

    console.log('Group key: ', i);
    console.log(getGroupKey.groupKey.groupPubKey);
  }

  await params.onGroupKeyList(groupKeyInfoList);

  await helper.sendQuery({
    startMta: {},
  });

  const { startMta } = await helper.waitForResult();
  assertOrThrowInvalidResult(startMta?.senderTimes);
  assertOrThrowInvalidResult(startMta?.receiverTimes);

  const { senderTimes } = startMta;
  const { receiverTimes } = startMta;

  const rcvPkInfoList: {
    to: number;
    from: number;
    length: number;
    data: string[];
    signature: string;
  }[] = [];

  for (let i = 0; i < receiverTimes; i += 1) {
    await helper.sendQuery({
      mtaRcvGetPkInitiate: {},
    });

    const { mtaRcvGetPkInitiate } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaRcvGetPkInitiate?.to);
    assertOrThrowInvalidResult(mtaRcvGetPkInitiate?.length);

    const pkInfo: {
      to: number;
      from: number;
      length: number;
      data: string[];
      signature: string;
    } = {
      to: mtaRcvGetPkInitiate.to,
      from: myIndex,
      length: mtaRcvGetPkInitiate.length,
      data: [],
      signature: '',
    };

    for (let j = 0; j < mtaRcvGetPkInitiate.length; j += 1) {
      await helper.sendQuery({
        mtaRcvGetPk: {},
      });

      const { mtaRcvGetPk } = await helper.waitForResult();
      assertOrThrowInvalidResult(mtaRcvGetPk?.publicKey);

      pkInfo.data.push(Buffer.from(mtaRcvGetPk.publicKey).toString('hex'));
    }

    await helper.sendQuery({
      mtaRcvGetPkSig: {},
    });

    const { mtaRcvGetPkSig } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaRcvGetPkSig?.signature);

    pkInfo.signature = Buffer.from(mtaRcvGetPkSig.signature).toString('hex');

    rcvPkInfoList.push(pkInfo);
  }

  await params.onRcvPkInfoList(rcvPkInfoList);

  const getRcvPkInfoList = await params.getRcvPkInfoList(myIndex);
  assertOrThrowInvalidResult(getRcvPkInfoList.length === senderTimes);

  getRcvPkInfoList.sort((a, b) => (a.from > b.from ? 1 : -1));

  const sndPkInfoList: {
    to: number;
    from: number;
    length: number;
    data: string[];
    signature: string;
  }[] = [];

  for (let i = 0; i < senderTimes; i += 1) {
    await helper.sendQuery({
      mtaSndGetPkInitiate: {},
    });

    const { mtaSndGetPkInitiate } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaSndGetPkInitiate?.to);
    assertOrThrowInvalidResult(mtaSndGetPkInitiate?.length);
    assertOrThrowInvalidResult(
      mtaSndGetPkInitiate.to === getRcvPkInfoList[i].from,
    );

    const pkInfo: {
      to: number;
      from: number;
      length: number;
      data: string[];
      signature: string;
    } = {
      to: mtaSndGetPkInitiate.to,
      from: myIndex,
      length: mtaSndGetPkInitiate.length,
      data: [],
      signature: '',
    };

    for (let j = 0; j < mtaSndGetPkInitiate.length; j += 1) {
      await helper.sendQuery({
        mtaSndGetPk: {
          publicKey: Buffer.from(getRcvPkInfoList[i].data[j], 'hex'),
        },
      });

      const { mtaSndGetPk } = await helper.waitForResult();
      assertOrThrowInvalidResult(mtaSndGetPk?.publicKey);

      pkInfo.data.push(Buffer.from(mtaSndGetPk.publicKey).toString('hex'));
    }

    await helper.sendQuery({
      mtaSndGetPkSig: {
        signature: Buffer.from(getRcvPkInfoList[i].signature, 'hex'),
      },
    });

    const { mtaSndGetPkSig } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaSndGetPkSig?.signature);

    pkInfo.signature = Buffer.from(mtaSndGetPkSig.signature).toString('hex');

    sndPkInfoList.push(pkInfo);
  }

  await params.onSndPkInfoList(sndPkInfoList);

  const getSndPkInfoList = await params.getSndPkInfoList(myIndex);
  assertOrThrowInvalidResult(getSndPkInfoList.length === receiverTimes);

  getSndPkInfoList.sort((a, b) => (a.from > b.from ? 1 : -1));

  return {
    success: true,
  };
};
