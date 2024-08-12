export enum WalletAuthEvent {
  INIT = 0,
  CARD_TAP = 1,
}

export type AuthWalletEventHandler = (event: WalletAuthEvent) => void;

export interface IAuthWalletParams {
  challenge: Uint8Array;
  walletId: Uint8Array;
  isPublicKey: boolean;
  onEvent?: AuthWalletEventHandler;
}
