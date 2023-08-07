import { SignTxnStatus } from '../../proto/generated/types';

export type SignTxnEventHandler = (event: SignTxnStatus) => void;

export interface ISignTxnInputData {
  prevTxnHash: string;
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
}
