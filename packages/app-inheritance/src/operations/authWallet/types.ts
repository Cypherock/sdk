export enum AuthWalletEvent {
  INIT = 0,
  SEED_BASED = 1,
  WALLET_BASED = 2,
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
