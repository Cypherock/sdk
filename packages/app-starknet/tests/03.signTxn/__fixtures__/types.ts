import { ISignTxnParams, ISignTxnResult } from '../../../src';

export interface ISignTxnTestCase {
  name: string;
  params: ISignTxnParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  mocks?: {
    eventCalls?: number[][];
  };
  output?: Partial<ISignTxnResult>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: ISignTxnTestCase[];
  invalidArgs: ISignTxnTestCase[];
  invalidData: ISignTxnTestCase[];
  error: ISignTxnTestCase[];
}
