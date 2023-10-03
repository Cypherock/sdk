import { SignMsgEventHandler } from './operations';
import { EIP712TypedData } from './utils';

export * from './operations/types';
export * from './proto/generated/types';

export interface ISignPersonalMsgParams {
  onEvent?: SignMsgEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  // hex string
  message: string;
}

export interface ISignTypedParams {
  onEvent?: SignMsgEventHandler;
  walletId: Uint8Array;
  derivationPath: number[];
  message: EIP712TypedData;
}
