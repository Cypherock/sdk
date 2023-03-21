import { ITrainUserResponse } from '../../../src';

export interface ITrainUserTestCase {
  name: string;
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
  output?: Partial<ITrainUserResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: ITrainUserTestCase[];
  invalidData: ITrainUserTestCase[];
}
