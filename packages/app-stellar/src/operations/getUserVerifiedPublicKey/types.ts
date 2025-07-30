import { GetPublicKeysEventHandler } from '../runGetPublicKeys/types';

export interface IGetUserVerifiedPublicKeyParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPath: number[]; // [44, 148, account] for Stellar
}

export interface IGetUserVerifiedPublicKeyResult {
  address: string; // Stellar address starting with 'G'
}
