import { IGetDeviceInfoResultResponse } from '../../../src';

export interface IGetDeviceInfoTestCase {
  name: string;
  query: Uint8Array;
  result: Uint8Array;
  output?: Partial<IGetDeviceInfoResultResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetDeviceInfoTestCase[];
  invalidData: IGetDeviceInfoTestCase[];
  error: IGetDeviceInfoTestCase[];
}
