import { SignTxnExternalSupportedTxnTypes } from '../../proto/generated/canton/sign_txn_external';

export enum SignTxnExternalEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTxnExternalEventHandler = (event: SignTxnExternalEvent) => void;

export interface IUnsignedExternalTransaction {
  txnSerializedHex: string;
  txnType: SignTxnExternalSupportedTxnTypes;
}

export interface ISignTxnExternalParams {
  onEvent?: SignTxnExternalEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  txn: IUnsignedExternalTransaction;
}

export interface ISignTxnExternalResult {
  signature: string;
}
