import { AddressFormat } from '../../proto/generated/types';
import { GetPublicKeysEventHandler } from '../runGetPublicKeys/types';

export interface IGetUserVerifiedPublicKeyParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  chainId: number;
  format?: AddressFormat;
  doVerifyOnDevice?: boolean;
}

export interface IGetUserVerifiedPublicKeyResult {
  publicKey: string;
  address: string;
}
