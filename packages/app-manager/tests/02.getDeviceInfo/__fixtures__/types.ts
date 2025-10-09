import { GetDeviceInfoResult } from '../../../src';

export interface IGetDeviceInfoTestCase {
  name: string;
  query: Uint8Array;
  result: Uint8Array;
  output?: Partial<GetDeviceInfoResult>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetDeviceInfoTestCase[];
  invalidData: IGetDeviceInfoTestCase[];
  error: IGetDeviceInfoTestCase[];
}
