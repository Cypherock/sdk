import { IGetWalletsResultResponse } from '../../../src';

export interface IGetWalletsTestCase {
  name: string;
  query: Uint8Array;
  result: Uint8Array;
  output?: Partial<IGetWalletsResultResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetWalletsTestCase[];
  error: IGetWalletsTestCase[];
  invalidData: IGetWalletsTestCase[];
}
