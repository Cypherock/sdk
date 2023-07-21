import { SignTxnStatus } from '../../proto/generated/types';

export type SignTxnEventHandler = (event: SignTxnStatus) => void;

export interface ISignTxnInputData {
  prevTxnHash: string;
  prevIndex: number;
  value: string;
  scriptPubKey: string;

  chainIndex: number;
  addressIndex: number;
  sequence?: number;
}

export interface ISignTxnOutputData {
  value: string;
  scriptPubKey: string;

  isChange: boolean;
  chainIndex?: number;
  addressIndex?: number;
}

export interface ISignTxnParams {
  walletId: Uint8Array;
  derivationPath: number[];
  onEvent?: SignTxnEventHandler;

  txn: {
    inputs: ISignTxnInputData[];
    outputs: ISignTxnOutputData[];
    rawTxn: string[];
    locktime?: number;
    hashType?: number;
  };
}

export interface ISignTxnResult {
  signatures: string[];
}
