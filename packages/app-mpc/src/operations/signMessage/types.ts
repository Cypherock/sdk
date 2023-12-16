export type ApproveMessageHandler = () => Promise<void>;

export interface ISignMessageParams {
  walletId: Uint8Array;
  groupID: Uint8Array;
  msg: Uint8Array;
  onMessageApproval: ApproveMessageHandler;
}

export interface ISignMessageResult {
  success: boolean;
}
