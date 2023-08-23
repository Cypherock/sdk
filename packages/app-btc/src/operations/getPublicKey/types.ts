import { IGetPublicKeyIntiateRequest } from '../../proto/generated/types';

export enum GetPublicKeyEvent {
  INIT = 0,
  CONFIRM = 1,
  PASSPHRASE = 2,
  PIN_CARD = 3,
  VERIFY = 4,
}

export type GetPublicKeyEventHandler = (event: GetPublicKeyEvent) => void;

export interface IGetPublicKeyParams extends IGetPublicKeyIntiateRequest {
  onEvent?: GetPublicKeyEventHandler;
}

export interface IGetPublicKeyResult {
  publicKey: Uint8Array;
  address: string;
}
