import {
  AddressFormat,
  IGetPublicKeysDerivationPath,
} from '../../proto/generated/types';

export enum GetPublicKeysEvent {
  INIT = 0,
  CONFIRM = 1,
  PASSPHRASE = 2,
  PIN_CARD = 3,
  VERIFY = 4,
}

export type GetPublicKeysEventHandler = (event: GetPublicKeysEvent) => void;

export interface IGetPublicKeysParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPaths: IGetPublicKeysDerivationPath[];
  chainId: number;
  format?: AddressFormat;
  doVerifyOnDevice?: boolean;
}

export interface IGetPublicKeysResult {
  publicKeys: string[];
  addresses: string[];
}
