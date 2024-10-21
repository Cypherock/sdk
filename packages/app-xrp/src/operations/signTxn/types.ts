import { Payment as PaymentTransaction } from 'xrpl';

export enum SignTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTxnEventHandler = (event: SignTxnEvent) => void;

export interface IUnsignedTransaction {
  rawTxn: PaymentTransaction;
  txnHex: string;
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
  serializedTxn?: string;
}
