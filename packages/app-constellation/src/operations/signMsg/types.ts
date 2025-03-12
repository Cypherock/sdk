import { SignMsgType } from '../../proto/generated/types';

export enum SignMsgEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignMsgEventHandler = (event: SignMsgEvent) => void;

export interface ISignMsgParams {
  onEvent?: SignMsgEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  message: string;
  messageType: SignMsgType;
}

export interface ISignMsgResult {
  signature: string;
}
