export enum AuthWalletEvent {
  INIT = 0,
  CARD_TAP = 1,
}

export type AuthWalletEventHandler = (event: AuthWalletEvent) => void;

export interface IAuthWalletParams {
  challenge: Uint8Array;
  walletId: Uint8Array;
  isPublicKey: boolean;
  onEvent?: AuthWalletEventHandler;
}
