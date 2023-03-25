import {
  AddressFormat,
  IDerivationPath,
  SignTxnStatus,
} from '../../proto/generated/types';

export type SignTxnEventHandler = (event: SignTxnStatus) => void;

export interface ISignTxnParams {
  onEvent?: SignTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: IDerivationPath[];
  txn: string;

  addressFormat?: AddressFormat;
  serializeTxn?: boolean;
}

export interface ISignTxnResult {
  signature: {
    r: string;
    s: string;
    v: string;
  };

  serializedTxn?: string;
}
