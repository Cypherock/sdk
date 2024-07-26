// TODO: Add status enums
export interface IWalletSignParams {
  challenge: Uint8Array;
  walletId: Uint8Array;
  isPublickey: boolean;
}
