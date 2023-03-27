import {
  IDerivationPath,
  SignMsgStatus,
  SignMsgType,
} from '../../proto/generated/types';

export type SignMsgEventHandler = (event: SignMsgStatus) => void;

export interface ISignMsgParams {
  onEvent?: SignMsgEventHandler;

  walletId: Uint8Array;
  derivationPath: IDerivationPath[];
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
