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
  message: Uint8Array;
  messageType: SignMsgType;
}

export interface ISignMsgResult {
  signature: {
    r: string;
    s: string;
    v: string;
  };

  // hex string
  serializedSignature: string;
}
