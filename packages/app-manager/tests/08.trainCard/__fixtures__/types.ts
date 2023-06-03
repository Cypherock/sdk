import { ITrainCardResult } from '../../../src';

export interface ITrainCardTestCase {
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
  isSelfCreated?: boolean;
  output?: Partial<ITrainCardResult>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: ITrainCardTestCase[];
  error: ITrainCardTestCase[];
  invalidData: ITrainCardTestCase[];
}
