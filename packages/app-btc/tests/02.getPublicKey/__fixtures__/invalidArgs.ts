import { IGetPublicKeyTestCase } from './types';

const commonParams = {
  queries: [{ name: 'empty', data: new Uint8Array([]) }],
  results: [{ name: 'empty', data: new Uint8Array([]) }],
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
    params: {
      derivationPath: [
        { index: 44, isHardened: true },
        { index: 0, isHardened: true },
        { index: 0, isHardened: true },
        { index: 0, isHardened: false },
        { index: 0, isHardened: false },
      ],
    } as any,
  },
  {
    name: 'Invalid derivation path',
    ...commonParams,
    params: {
      walletId: new Uint8Array([10]),
      derivationPath: [{}, {}, {}],
    } as any,
  },
];

export default invalidArgs;
