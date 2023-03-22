import { IGetPublicKeyParams, IGetPublicKeyResultResponse } from '../../../src';

export interface IGetPublicKeyTestCase {
  name: string;
  params: IGetPublicKeyParams;
  query: Uint8Array;
  result: Uint8Array;
  output?: Partial<IGetPublicKeyResultResponse>;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetPublicKeyTestCase[];
  invalidData: IGetPublicKeyTestCase[];
  error: IGetPublicKeyTestCase[];
  invalidArgs: IGetPublicKeyTestCase[];
}
