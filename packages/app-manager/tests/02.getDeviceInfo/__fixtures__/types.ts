import { IGetDeviceInfoResponse } from '../../../src';

export interface IGetDeviceInfoTestCase {
  name: string;
  query: Uint8Array;
  result: Uint8Array;
  output?: Partial<IGetDeviceInfoResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetDeviceInfoTestCase[];
  error: IGetDeviceInfoTestCase[];
}
