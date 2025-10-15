export enum SignTopologyTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTopologyTxnEventHandler = (event: SignTopologyTxnEvent) => void;

export interface IUnsignedTopologyTransaction {
  partyTransactions: Uint8Array[];
}

export interface ISignTopologyTxnParams {
  onEvent?: SignTopologyTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  topologyTxn: IUnsignedTopologyTransaction;
  serializeTopologyTxn?: boolean;
}

export interface ISignTopologyTxnResult {
  signature: string;
  serializedTopologyTxn?: string;
}
