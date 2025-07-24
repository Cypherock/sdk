export enum SignTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTxnEventHandler = (event: SignTxnEvent) => void;

// STELLAR interface for XDR transaction format
export interface IUnsignedTransaction {
  xdr: string; // Base64 XDR transaction envelope
  networkPassphrase: string; // Network identifier (testnet/mainnet)
}

export interface ISignTxnParams {
  onEvent?: SignTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: number[]; // [44, 148, account] for Stellar
  txn: IUnsignedTransaction;
  serializeTxn?: boolean;
}

export interface ISignTxnResult {
  signature: string; // Hex string of Ed25519 signature
  serializedTxn?: string; // Signed XDR ready for broadcast (if serializeTxn=true)
}
