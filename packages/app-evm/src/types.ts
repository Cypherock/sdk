import { SignMsgEventHandler } from './operations';
import { IDerivationPath } from './proto/generated/types';

export * from './operations/types';
export * from './proto/generated/types';

export interface ISignPersonalMsgParams {
  onEvent?: SignMsgEventHandler;

  walletId: Uint8Array;
  derivationPath: IDerivationPath[];
  // hex string
  message: string;
}
