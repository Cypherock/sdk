export enum SignTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTxnEventHandler = (event: SignTxnEvent) => void;

export interface IUnsignedTransaction {
  txnDataHex: string;
}

export interface ISignTxnParams {
  onEvent?: SignTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  txn: IUnsignedTransaction;
}

export interface ISignTxnResult {
  signature: string;
}
