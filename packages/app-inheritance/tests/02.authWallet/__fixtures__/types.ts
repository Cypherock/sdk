import { IAuthWalletParams, IWalletAuthResultResponse } from '../../../src';

export interface IAuthWalletTestCase {
  name: string;
  params: IAuthWalletParams;
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
  output?: Partial<IWalletAuthResultResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IAuthWalletTestCase[];
  error: IAuthWalletTestCase[];
  invalidArgs: IAuthWalletTestCase[];
}
