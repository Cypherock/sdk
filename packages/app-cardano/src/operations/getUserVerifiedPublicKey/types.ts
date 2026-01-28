import { GetPublicKeysEventHandler } from '../runGetPublicKeys/types';

export interface IGetUserVerifiedPublicKeyParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
}

export interface IGetUserVerifiedPublicKeyResult {
  publicKey: {
    stake: string;
    payment: string;
  };
  address: {
    stake: string;
    payment: string;
  };
}
