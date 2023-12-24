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

export type ApproveMessageHandler = () => Promise<void>;
export type GetGroupInfoHandler = () => Promise<{
  groupInfo: GroupInfo;
  groupInfoSignature: Uint8Array;
  groupKeyInfo: GroupKeyInfo;
  groupKeyInfoSignature: Uint8Array;
}>;
export type GetSequenceIndicesHandler = () => Promise<number[]>;
export type ShareDataListHandler = (
  shareDataList: SignedShareData[],
) => Promise<SignedShareData[][]>;
export type SignedPubKeyListHandler = (
  signedPublicKeyList: SignedPublicKey[],
) => Promise<SignedPublicKey[][]>;
export type SignedGroupKeyInfo = {
  groupKeyInfo: GroupKeyInfo;
  signature: Uint8Array;
};
export type GroupKeyListHandler = (
  signedGroupKeyInfoList: SignedGroupKeyInfo[],
) => Promise<void>;
export type RcvPkInfoListHandler = (
  rcvPkInfoList: {
    to: number;
    from: number;
    length: number;
    data: string[];
    signature: string;
  }[],
) => Promise<void>;
export type GetRcvPkInfoListHandler = (
  myIndex: number,
  length: number,
) => Promise<
  {
    to: number;
    from: number;
    length: number;
    data: string[];
    signature: string;
  }[]
>;
export type SndPkInfoListHandler = (
  sndPkInfoList: {
    to: number;
    from: number;
    length: number;
    data: string[];
    signature: string;
  }[],
) => Promise<void>;
export type GetSndPkInfoListHandler = (
  myIndex: number,
  length: number,
) => Promise<
  {
    to: number;
    from: number;
    length: number;
    data: string[];
    signature: string;
  }[]
>;
export type RcvEncMsgListHandler = (
  rcvEncMsgList: {
    to: number;
    from: number;
    length: number;
    data: { e0: string; e1: string }[];
    signature: string;
  }[],
) => Promise<void>;
export type GetRcvEncMsgListHandler = (
  myIndex: number,
  length: number,
) => Promise<
  {
    to: number;
    from: number;
    length: number;
    data: { e0: string; e1: string }[];
    signature: string;
  }[]
>;
export type SndMascotListHandler = (
  sndMascotList: {
    to: number;
    from: number;
    length: number;
    data: { e0: string; e1: string }[];
    signature: string;
  }[],
) => Promise<void>;
export type GetSndMascotListHandler = (
  myIndex: number,
  length: number,
) => Promise<
  {
    to: number;
    from: number;
    length: number;
    data: { e0: string; e1: string }[];
    signature: string;
  }[]
>;
export type SignedAuthenticatorDataHandler = (data: {
  from: number;
  signedAuthenticatorData: SignedAuthenticatorData;
}) => Promise<void>;
export type GetSignedAuthenticatorDataListHandler = () => Promise<
  {
    from: number;
    signedAuthenticatorData: SignedAuthenticatorData;
  }[]
>;
export type SignedKaShareHandler = (data: {
  from: number;
  signedKaShare: SignedKAShare;
}) => Promise<void>;
export type GetSignedKaShareListHandler = () => Promise<
  {
    from: number;
    signedKaShare: SignedKAShare;
  }[]
>;
export type SignedSigShareHandler = (data: {
  from: number;
  signedSigShare: SignedSigShare;
}) => Promise<void>;
export type GetSignedSigShareListHandler = () => Promise<
  {
    from: number;
    signedSigShare: SignedSigShare;
  }[]
>;

export interface ISignMessageParams {
  walletId: Uint8Array;
  groupID: Uint8Array;
  msg: Uint8Array;
  onMessageApproval: ApproveMessageHandler;
  getGroupInfo: GetGroupInfoHandler;
  getSequenceIndices: GetSequenceIndicesHandler;
  onShareDataList: ShareDataListHandler;
  onSignedPubKeyList: SignedPubKeyListHandler;
  onGroupKeyList: GroupKeyListHandler;
  onRcvPkInfoList: RcvPkInfoListHandler;
  getRcvPkInfoList: GetRcvPkInfoListHandler;
  onSndPkInfoList: SndPkInfoListHandler;
  getSndPkInfoList: GetSndPkInfoListHandler;
  onRcvEncMsgList: RcvEncMsgListHandler;
  getRcvEncMsgList: GetRcvEncMsgListHandler;
  onSndMascotList: SndMascotListHandler;
  getSndMascotList: GetSndMascotListHandler;
  onSignedAuthenticatorData: SignedAuthenticatorDataHandler;
  getSignedAuthenticatorDataList: GetSignedAuthenticatorDataListHandler;
  onSignedKaShare: SignedKaShareHandler;
  getSignedKaShareList: GetSignedKaShareListHandler;
  onSignedSigShare: SignedSigShareHandler;
  getSignedSigShareList: GetSignedSigShareListHandler;
}

export interface ISignMessageResult {
  signature: Uint8Array;
}
