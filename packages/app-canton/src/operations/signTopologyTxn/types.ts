import { CantonNetworkType } from '../../proto/generated/canton/common';

export enum SignTopologyTxnEvent {
  INIT = 0,
  CONFIRM = 1,
  VERIFY = 2,
  PASSPHRASE = 3,
  PIN_CARD = 4,
}

export type SignTopologyTxnEventHandler = (event: SignTopologyTxnEvent) => void;

export interface IUnsignedTopologyTransaction {
  partyTransactions: string[];
}

export interface ISignTopologyTxnParams {
  onEvent?: SignTopologyTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  topologyTxn: IUnsignedTopologyTransaction;
  network?: CantonNetworkType;
}

export interface ISignTopologyTxnResult {
  signature: string;
}
