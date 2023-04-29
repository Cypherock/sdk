import { IGetXpubsParams, IGetXpubsResultResponse } from '../../../src';

export interface IGetXpubsTestCase {
  name: string;
  params: IGetXpubsParams;
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
  output?: Partial<IGetXpubsResultResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetXpubsTestCase[];
  invalidData: IGetXpubsTestCase[];
  error: IGetXpubsTestCase[];
  invalidArgs: IGetXpubsTestCase[];
}
