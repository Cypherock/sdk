import { GetPublicKeysEventHandler } from '../runGetPublicKeys/types';

export interface IGetUserVerifiedPublicKeyParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPath: number[]; // Sia derivation path (m | index)
}

export interface IGetUserVerifiedPublicKeyResult {
  publicKey: string;
  address: string; // Sia 77 length address
}
