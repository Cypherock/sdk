export enum AuthWalletEvent {
  INIT = 0,
  CONFIRMED = 1,
  SEED_BASED_CARD_TAP = 2,
  CARD_PAIRING_CARD_TAP = 3,
  WALLET_BASED_CARD_TAP = 4,
}

export type AuthWalletType =
  | 'seed-based'
  | 'wallet-based'
  | 'seed-and-wallet-based';

export type AuthWalletEventHandler = (event: AuthWalletEvent) => void;

export interface IAuthWalletParams {
  challenge: Uint8Array;
  walletId: Uint8Array;
  withPublicKey: boolean;
  type: AuthWalletType;
  onEvent?: AuthWalletEventHandler;
}
