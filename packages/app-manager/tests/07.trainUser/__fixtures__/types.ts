import { ITrainUserResultResponse } from '../../../src';

export interface ITrainUserTestCase {
  name: string;
  params?: { jumpToState?: number };
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
  output?: Partial<ITrainUserResultResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: ITrainUserTestCase[];
  invalidData: ITrainUserTestCase[];
  error: ITrainUserTestCase[];
}
