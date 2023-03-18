import { IGetWalletsResponse } from '../../../src';

export interface IGetWalletsTestCase {
  name: string;
  query: Uint8Array;
  result: Uint8Array;
  output?: Partial<IGetWalletsResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetWalletsTestCase[];
  error: IGetWalletsTestCase[];
}
