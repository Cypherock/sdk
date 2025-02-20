import { IGetPublicKeysParams, IGetPublicKeysResult } from '../../../src';

export interface IGetPublicKeysTestCase {
  name: string;
  params: IGetPublicKeysParams;
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
  output?: Partial<IGetPublicKeysResult>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetPublicKeysTestCase[];
  invalidData: IGetPublicKeysTestCase[];
  error: IGetPublicKeysTestCase[];
  invalidArgs: IGetPublicKeysTestCase[];
}
