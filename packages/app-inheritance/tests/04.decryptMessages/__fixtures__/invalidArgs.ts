import { IDecryptMessagesParams } from '../../../src';
import { IDecryptMessagesTestCase } from './types';

const commonParams = {
  queries: [{ name: 'empty', data: new Uint8Array([]) }],
  results: [{ name: 'empty', data: new Uint8Array([]) }],
  errorInstance: Error,
  errorMessage: /AssertionError/,
};

const validParams: IDecryptMessagesParams = {
  encryptedData: new Uint8Array([0]),
};

const invalidArgs: IDecryptMessagesTestCase[] = [
  {
    name: 'Null',
    ...commonParams,
    params: null as any,
  },
  {
    name: 'Undefined',
    ...commonParams,
    params: null as any,
  },
  {
    name: 'Empty Object',
    ...commonParams,
    params: {} as any,
  },
  {
    name: 'No data',
    ...commonParams,
    params: { ...validParams, encryptedData: undefined } as any,
  },
  {
    name: 'Empty data',
    ...commonParams,
    params: {
      ...validParams,
      encryptedData: [],
    } as any,
  },
];

export default invalidArgs;
