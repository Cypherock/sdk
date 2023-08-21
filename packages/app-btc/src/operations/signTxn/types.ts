export enum SignTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTxnEventHandler = (event: SignTxnEvent) => void;

export interface ISignTxnInputData {
  prevTxnId: string;
  prevIndex: number;
  value: string;
  address: string;

  changeIndex: number;
  addressIndex: number;

  prevTxn?: string;
  sequence?: number;
}

export interface ISignTxnOutputData {
  value: string;
  address: string;

  isChange: boolean;
  addressIndex?: number;
}

export interface ISignTxnParams {
  walletId: Uint8Array;
  derivationPath: number[];
  onEvent?: SignTxnEventHandler;

  txn: {
    inputs: ISignTxnInputData[];
    outputs: ISignTxnOutputData[];
    locktime?: number;
    hashType?: number;
  };
}

export interface ISignTxnResult {
  signatures: string[];
  signedTransaction: string;
}
