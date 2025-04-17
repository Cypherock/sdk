export interface IAccountInfo {
  appletId: number;
  walletId: Uint8Array;
}

export interface IInitiateFlowParams {
  from: IAccountInfo;
  to: IAccountInfo;
}
