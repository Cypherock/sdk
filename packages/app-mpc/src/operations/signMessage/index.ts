import { ISDK } from '@cypherock/sdk-core';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import {
  ISignMessageParams,
  ISignMessageResult,
  MtaData,
  SignedGroupKeyInfo,
} from './types';
import {
  GroupInfo,
  GroupKeyInfo,
  SignedAuthenticatorData,
  SignedPublicKey,
  SignedShareData,
} from '../../proto/generated/mpc_poc/common';
import {
  SignedKAShare,
  SignedSigShare,
} from '../../proto/generated/mpc_poc/sign_message';

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

  const rcvPkInfoList: MtaData[] = [];

  for (let i = 0; i < receiverTimes; i += 1) {
    await helper.sendQuery({
      mtaRcvGetPkInitiate: {},
    });

    const { mtaRcvGetPkInitiate } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaRcvGetPkInitiate?.to);
    assertOrThrowInvalidResult(mtaRcvGetPkInitiate?.length);

    const pkInfo: MtaData = {
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

      pkInfo.data.push({
        first: Buffer.from(mtaRcvGetPk.publicKey).toString('hex'),
        second: '',
      });
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

  const getRcvPkInfoList = await params.getRcvPkInfoList(myIndex, senderTimes);
  assertOrThrowInvalidResult(getRcvPkInfoList.length === senderTimes);

  getRcvPkInfoList.sort((a, b) => (a.from > b.from ? 1 : -1));

  const sndPkInfoList: MtaData[] = [];

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

    const pkInfo: MtaData = {
      to: mtaSndGetPkInitiate.to,
      from: myIndex,
      length: mtaSndGetPkInitiate.length,
      data: [],
      signature: '',
    };

    for (let j = 0; j < mtaSndGetPkInitiate.length; j += 1) {
      await helper.sendQuery({
        mtaSndGetPk: {
          publicKey: Buffer.from(getRcvPkInfoList[i].data[j].first, 'hex'),
        },
      });

      const { mtaSndGetPk } = await helper.waitForResult();
      assertOrThrowInvalidResult(mtaSndGetPk?.publicKey);

      pkInfo.data.push({
        first: Buffer.from(mtaSndGetPk.publicKey).toString('hex'),
        second: '',
      });
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

  const getSndPkInfoList = await params.getSndPkInfoList(
    myIndex,
    receiverTimes,
  );
  assertOrThrowInvalidResult(getSndPkInfoList.length === receiverTimes);

  getSndPkInfoList.sort((a, b) => (a.from > b.from ? 1 : -1));

  const rcvEncMsgList: MtaData[] = [];

  for (let i = 0; i < receiverTimes; i += 1) {
    await helper.sendQuery({
      mtaRcvGetEncInitiate: {},
    });

    const { mtaRcvGetEncInitiate } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaRcvGetEncInitiate?.to);
    assertOrThrowInvalidResult(mtaRcvGetEncInitiate?.length);
    assertOrThrowInvalidResult(
      mtaRcvGetEncInitiate.to === getSndPkInfoList[i].from,
    );

    const encInfo: MtaData = {
      to: mtaRcvGetEncInitiate.to,
      from: myIndex,
      length: mtaRcvGetEncInitiate.length,
      data: [],
      signature: '',
    };

    for (let j = 0; j < mtaRcvGetEncInitiate.length; j += 1) {
      await helper.sendQuery({
        mtaRcvGetEnc: {
          publicKey: Buffer.from(getSndPkInfoList[i].data[j].first, 'hex'),
        },
      });

      const { mtaRcvGetEnc } = await helper.waitForResult();
      assertOrThrowInvalidResult(mtaRcvGetEnc?.encM0);
      assertOrThrowInvalidResult(mtaRcvGetEnc?.encM1);

      encInfo.data.push({
        first: Buffer.from(mtaRcvGetEnc.encM0).toString('hex'),
        second: Buffer.from(mtaRcvGetEnc.encM1).toString('hex'),
      });
    }

    await helper.sendQuery({
      mtaRcvGetEncSig: {
        signature: Buffer.from(getSndPkInfoList[i].signature, 'hex'),
      },
    });

    const { mtaRcvGetEncSig } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaRcvGetEncSig?.signature);

    encInfo.signature = Buffer.from(mtaRcvGetEncSig.signature).toString('hex');

    rcvEncMsgList.push(encInfo);
  }

  await params.onRcvEncMsgList(rcvEncMsgList);

  const getRcvEncMsgList = await params.getRcvEncMsgList(myIndex, senderTimes);
  assertOrThrowInvalidResult(getRcvEncMsgList.length === senderTimes);

  getRcvEncMsgList.sort((a, b) => (a.from > b.from ? 1 : -1));

  for (let i = 0; i < senderTimes; i += 1) {
    await helper.sendQuery({
      mtaSndPostEncInitiate: {},
    });

    const { mtaSndPostEncInitiate } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaSndPostEncInitiate?.to);
    assertOrThrowInvalidResult(mtaSndPostEncInitiate?.length);
    assertOrThrowInvalidResult(
      mtaSndPostEncInitiate.to === getRcvEncMsgList[i].from,
    );

    for (let j = 0; j < mtaSndPostEncInitiate.length; j += 1) {
      await helper.sendQuery({
        mtaSndPostEnc: {
          encM0: Buffer.from(getRcvEncMsgList[i].data[j].first, 'hex'),
          encM1: Buffer.from(getRcvEncMsgList[i].data[j].second, 'hex'),
        },
      });

      await helper.waitForResult();
    }

    await helper.sendQuery({
      mtaSndPostEncSig: {
        signature: Buffer.from(getRcvEncMsgList[i].signature, 'hex'),
      },
    });

    await helper.waitForResult();
  }

  const sndMASCOTList: MtaData[] = [];

  for (let i = 0; i < senderTimes; i += 1) {
    await helper.sendQuery({
      mtaSndGetMascotInitiate: {},
    });

    const { mtaSndGetMascotInitiate } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaSndGetMascotInitiate?.to);
    assertOrThrowInvalidResult(mtaSndGetMascotInitiate?.length);

    const mascotInfo: MtaData = {
      to: mtaSndGetMascotInitiate.to,
      from: myIndex,
      length: mtaSndGetMascotInitiate.length,
      data: [],
      signature: '',
    };

    for (let j = 0; j < mtaSndGetMascotInitiate.length; j += 1) {
      await helper.sendQuery({
        mtaSndGetMascot: {},
      });

      const { mtaSndGetMascot } = await helper.waitForResult();
      assertOrThrowInvalidResult(mtaSndGetMascot?.encM0);
      assertOrThrowInvalidResult(mtaSndGetMascot?.encM1);

      mascotInfo.data.push({
        first: Buffer.from(mtaSndGetMascot.encM0).toString('hex'),
        second: Buffer.from(mtaSndGetMascot.encM1).toString('hex'),
      });
    }

    await helper.sendQuery({
      mtaSndGetMascotSig: {},
    });

    const { mtaSndGetMascotSig } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaSndGetMascotSig?.signature);

    mascotInfo.signature = Buffer.from(mtaSndGetMascotSig.signature).toString(
      'hex',
    );

    sndMASCOTList.push(mascotInfo);
  }

  await params.onSndMascotList(sndMASCOTList);

  const getSndMASCOTList = await params.getSndMascotList(
    myIndex,
    receiverTimes,
  );
  assertOrThrowInvalidResult(getSndMASCOTList.length === receiverTimes);

  getSndMASCOTList.sort((a, b) => (a.from > b.from ? 1 : -1));

  for (let i = 0; i < receiverTimes; i += 1) {
    await helper.sendQuery({
      mtaRcvPostMascotInitiate: {},
    });

    const { mtaRcvPostMascotInitiate } = await helper.waitForResult();
    assertOrThrowInvalidResult(mtaRcvPostMascotInitiate?.to);
    assertOrThrowInvalidResult(mtaRcvPostMascotInitiate?.length);
    assertOrThrowInvalidResult(
      mtaRcvPostMascotInitiate.to === getSndMASCOTList[i].from,
    );

    for (let j = 0; j < mtaRcvPostMascotInitiate.length; j += 1) {
      await helper.sendQuery({
        mtaRcvPostMascot: {
          encM0: Buffer.from(getSndMASCOTList[i].data[j].first, 'hex'),
          encM1: Buffer.from(getSndMASCOTList[i].data[j].second, 'hex'),
        },
      });

      await helper.waitForResult();
    }

    await helper.sendQuery({
      mtaRcvPostMascotSig: {
        signature: Buffer.from(getSndMASCOTList[i].signature, 'hex'),
      },
    });

    await helper.waitForResult();
  }

  await helper.sendQuery({
    sigGetAuthenticator: {},
  });

  const { sigGetAuthenticator } = await helper.waitForResult();
  assertOrThrowInvalidResult(sigGetAuthenticator?.signedAuthenticatorData);

  await params.onSignedAuthenticatorData({
    from: myIndex,
    signedAuthenticatorData: Buffer.from(
      SignedAuthenticatorData.encode(
        sigGetAuthenticator.signedAuthenticatorData,
      ).finish(),
    ).toString('hex'),
  });

  let getSignedAuthenticatorDataList: {
    from: number;
    signedAuthenticatorData: string;
  }[] = await params.getSignedAuthenticatorDataList();

  // remove the item from the list where 'from' is myIndex
  getSignedAuthenticatorDataList = getSignedAuthenticatorDataList.filter(
    item => item.from !== myIndex,
  );

  // sort getSignedAuthenticatorDataList by 'from' field
  getSignedAuthenticatorDataList.sort((a, b) => (a.from > b.from ? 1 : -1));

  // get the list of SignedAuthenticatorData[] rom getSignedAuthenticatorDataList
  const signedAuthenticatorDataList: SignedAuthenticatorData[] = [];
  getSignedAuthenticatorDataList.forEach(item => {
    signedAuthenticatorDataList.push(
      SignedAuthenticatorData.decode(
        new Uint8Array(Buffer.from(item.signedAuthenticatorData, 'hex')),
      ),
    );
  });

  await helper.sendQuery({
    sigComputeAuthenticator: {
      signedAuthenticatorDataList,
    },
  });

  await helper.waitForResult();

  await helper.sendQuery({
    sigGetKaShare: {},
  });

  const { sigGetKaShare } = await helper.waitForResult();
  assertOrThrowInvalidResult(sigGetKaShare?.signedKaShare);

  await params.onSignedKaShare({
    from: myIndex,
    signedKaShare: Buffer.from(
      SignedKAShare.encode(sigGetKaShare.signedKaShare).finish(),
    ).toString('hex'),
  });

  let getSignedKaShareList: {
    from: number;
    signedKaShare: string;
  }[] = await params.getSignedKaShareList();

  // remove the item from the list where 'from' is myIndex
  getSignedKaShareList = getSignedKaShareList.filter(
    item => item.from !== myIndex,
  );

  // sort getSignedKaShareList by 'from' field
  getSignedKaShareList.sort((a, b) => (a.from > b.from ? 1 : -1));

  // get the list of SignedKAShare[] rom getSignedKaShareList
  const signedKaShareList: SignedKAShare[] = [];
  getSignedKaShareList.forEach(item => {
    signedKaShareList.push(
      SignedKAShare.decode(
        new Uint8Array(Buffer.from(item.signedKaShare, 'hex')),
      ),
    );
  });

  await helper.sendQuery({
    sigComputeKa: {
      signedKaShareList,
    },
  });

  await helper.waitForResult();

  await helper.sendQuery({
    getSigShare: {},
  });

  const { getSigShare } = await helper.waitForResult();
  assertOrThrowInvalidResult(getSigShare?.signedSigShare);

  await params.onSignedSigShare({
    from: myIndex,
    signedSigShare: Buffer.from(
      SignedSigShare.encode(getSigShare.signedSigShare).finish(),
    ).toString('hex'),
  });

  let getSignedSigShareList: {
    from: number;
    signedSigShare: string;
  }[] = await params.getSignedSigShareList();

  // remove the item from the list where 'from' is myIndex
  getSignedSigShareList = getSignedSigShareList.filter(
    item => item.from !== myIndex,
  );

  // sort getSignedSigShareList by 'from' field
  getSignedSigShareList.sort((a, b) => (a.from > b.from ? 1 : -1));

  // get the list of SignedShareData[] rom getSignedSigShareList
  const signedSigShareList: SignedSigShare[] = [];

  getSignedSigShareList.forEach(item => {
    signedSigShareList.push(
      SignedSigShare.decode(
        new Uint8Array(Buffer.from(item.signedSigShare, 'hex')),
      ),
    );
  });

  await helper.sendQuery({
    computeSig: {
      signedSigShareList,
    },
  });

  const { computeSig } = await helper.waitForResult();
  assertOrThrowInvalidResult(computeSig?.signature);

  return {
    signature: computeSig.signature,
  };
};
