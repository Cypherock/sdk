import { IGetPublicKeysDerivationPath } from '../../proto/generated/types';

export enum GetPublicKeysEvent {
  INIT = 0,
  CONFIRM = 1,
  PASSPHRASE = 2,
  PIN_CARD = 3,
  ACCOUNT_ID_VERIFY = 4,
  PRINCIPAL_ID_VERIFY = 5,
}

export type GetPublicKeysEventHandler = (event: GetPublicKeysEvent) => void;

export interface IGetPublicKeysParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPaths: IGetPublicKeysDerivationPath[];
}

export interface IGetPublicKeysResult {
  publicKeys: string[];
}
