import { WalletAuthStatus } from '../../proto/generated/types';

export type AuthWalletEventHandler = (event: WalletAuthStatus) => void;
export const WALLET_ID_LENGTH = 32;

export interface IAuthWalletParams {
  challenge: Uint8Array;
  walletId: Uint8Array;
  isPublickey: boolean;
  onEvent?: AuthWalletEventHandler;
}
