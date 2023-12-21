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
}

export interface ISignMessageResult {
  success: boolean;
}
