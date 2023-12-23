import {
  GroupInfo,
  GroupKeyInfo,
  SignedPublicKey,
  SignedShareData,
} from '../../proto/generated/mpc_poc/common';

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
export type GetRcvPkInfoListHandler = (myIndex: number) => Promise<
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
export type GetSndPkInfoListHandler = (myIndex: number) => Promise<
  {
    to: number;
    from: number;
    length: number;
    data: string[];
    signature: string;
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
}

export interface ISignMessageResult {
  success: boolean;
}
