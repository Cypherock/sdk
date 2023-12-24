import {
  GroupInfo,
  GroupKeyInfo,
  SignedPublicKey,
  SignedShareData,
} from '../../proto/generated/mpc_poc/common';

export type MtaData = {
  to: number;
  from: number;
  length: number;
  data: { first: string; second: string }[];
  signature: string;
};

export type SigCalcData = {
  from: number;
  data: string;
};

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
export type RcvPkInfoListHandler = (rcvPkInfoList: MtaData[]) => Promise<void>;
export type GetRcvPkInfoListHandler = (
  myIndex: number,
  length: number,
) => Promise<MtaData[]>;
export type SndPkInfoListHandler = (sndPkInfoList: MtaData[]) => Promise<void>;
export type GetSndPkInfoListHandler = (
  myIndex: number,
  length: number,
) => Promise<MtaData[]>;
export type RcvEncMsgListHandler = (rcvEncMsgList: MtaData[]) => Promise<void>;
export type GetRcvEncMsgListHandler = (
  myIndex: number,
  length: number,
) => Promise<MtaData[]>;
export type SndMascotListHandler = (sndMascotList: MtaData[]) => Promise<void>;
export type GetSndMascotListHandler = (
  myIndex: number,
  length: number,
) => Promise<MtaData[]>;
export type SignedAuthenticatorDataHandler = (
  data: SigCalcData,
) => Promise<void>;
export type GetSignedAuthenticatorDataListHandler = () => Promise<
  SigCalcData[]
>;
export type SignedKaShareHandler = (data: SigCalcData) => Promise<void>;
export type GetSignedKaShareListHandler = () => Promise<SigCalcData[]>;
export type SignedSigShareHandler = (data: SigCalcData) => Promise<void>;
export type GetSignedSigShareListHandler = () => Promise<SigCalcData[]>;

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
