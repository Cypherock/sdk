import { IGetPublicKeyTestCase } from './types';

const commonParams = {
  query: new Uint8Array([]),
  result: new Uint8Array([]),
  errorInstance: Error,
  errorMessage: /AssertionError/,
};

const invalidArgs: IGetPublicKeyTestCase[] = [
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
    name: 'No derivation path',
    ...commonParams,
    params: { walletId: new Uint8Array([]) } as any,
  },
  {
    name: 'No wallet id',
    ...commonParams,
    params: { derivation: [] } as any,
  },
];

export default invalidArgs;
