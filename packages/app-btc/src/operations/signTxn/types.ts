import { SignTxnStatus } from '../../proto/generated/types';

export type SignTxnEventHandler = (event: SignTxnStatus) => void;

export interface ISignTxnInput {
  prevTxnHash: string;
  prevIndex: number;
  value: string;
  address: string;

  changeIndex: number;
  addressIndex: number;

  prevTxn?: string;
  sequence?: number;
}

export interface ISignTxnOutput {
  value: string;
  address: string;

  isChange: boolean;
  changeIndex?: number;
  addressIndex?: number;
}

export interface ISignTxnParams {
  walletId: Uint8Array;
  derivationPath: number[];
  onEvent?: SignTxnEventHandler;

  txn: {
    inputs: ISignTxnInput[];
    outputs: ISignTxnOutput[];
    locktime?: number;
    hashType?: number;
  };
}

export interface ISignTxnResult {
  signatures: string[];
}
