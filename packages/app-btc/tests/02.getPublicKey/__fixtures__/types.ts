import { IGetPublicKeyParams, IGetPublicKeyResult } from '../../../src';

export interface IGetPublicKeyTestCase {
  name: string;
  params: IGetPublicKeyParams;
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
  output?: Partial<IGetPublicKeyResult>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetPublicKeyTestCase[];
  invalidData: IGetPublicKeyTestCase[];
  error: IGetPublicKeyTestCase[];
  invalidArgs: IGetPublicKeyTestCase[];
}
