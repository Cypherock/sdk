export enum SignTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTxnEventHandler = (event: SignTxnEvent) => void;

// Sia interface SiaV2 transaction
export interface IUnsignedTransaction {
  blob: string; // Serialized semantics of SiaV2 transaction
}

export interface ISignTxnParams {
  onEvent?: SignTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: number[]; // (m | index) for Sia
  txn: IUnsignedTransaction;
}

export interface ISignTxnResult {
  signature: string;
}
