import { ISignMsgResult, ISignPersonalMsgParams } from '../../../src';

export interface ISignPersonalMsgTestCase {
  name: string;
  params: ISignPersonalMsgParams;
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
  output?: Partial<ISignMsgResult>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: ISignPersonalMsgTestCase[];
  invalidArgs: ISignPersonalMsgTestCase[];
  invalidData: ISignPersonalMsgTestCase[];
  error: ISignPersonalMsgTestCase[];
}
