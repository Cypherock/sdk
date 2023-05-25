import { ITrainCardResult } from '../../../src';

export interface ITrainCardTestCase {
  name: string;
  query: Uint8Array;
  result: Uint8Array;
  output?: Partial<ITrainCardResult>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: ITrainCardTestCase[];
  error: ITrainCardTestCase[];
  invalidData: ITrainCardTestCase[];
}
