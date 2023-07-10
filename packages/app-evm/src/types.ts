import { SignMsgEventHandler } from './operations';

export * from './operations/types';
export * from './proto/generated/types';

export interface ISignPersonalMsgParams {
  onEvent?: SignMsgEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  // hex string
  message: string;
}
