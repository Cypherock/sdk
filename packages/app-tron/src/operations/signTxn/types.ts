export enum SignTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTxnEventHandler = (event: SignTxnEvent) => void;

export interface IUnsignedTransaction {
  visible?: boolean;
  txID: string;
  // eslint-disable-next-line camelcase
  raw_data: any;
  // eslint-disable-next-line camelcase
  raw_data_hex: string;
}

export interface ISignedTransaction extends IUnsignedTransaction {
  signature: string[];
}

export interface ISignTxnParams {
  onEvent?: SignTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  txn: IUnsignedTransaction;
  serializeTxn?: boolean;
}

export interface ISignTxnResult {
  signature: string;
  signedTransaction?: ISignedTransaction;
}
