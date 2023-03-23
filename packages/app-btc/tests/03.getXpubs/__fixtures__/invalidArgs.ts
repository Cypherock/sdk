import { IGetXpubsTestCase } from './types';

const commonParams = {
  queries: [{ name: 'empty', data: new Uint8Array([]) }],
  results: [{ name: 'empty', data: new Uint8Array([]) }],
  errorInstance: Error,
  errorMessage: /AssertionError/,
};

const invalidArgs: IGetXpubsTestCase[] = [
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
    name: 'No derivation paths',
    ...commonParams,
    params: { walletId: new Uint8Array([]) } as any,
  },
  {
    name: 'No wallet id',
    ...commonParams,
    params: {
      derivationPaths: [
        {
          path: [
            { index: 44, isHardened: true },
            { index: 0, isHardened: true },
            { index: 0, isHardened: true },
          ],
        },
      ],
    } as any,
  },
  {
    name: 'Empty derivation path',
    ...commonParams,
    params: {
      walletId: new Uint8Array([10]),
      derivationPaths: [],
    } as any,
  },
  {
    name: 'invalid derivation path in array (depth:2)',
    ...commonParams,
    params: {
      walletId: new Uint8Array([10]),
      derivationPaths: [
        {
          path: [
            { index: 44, isHardened: true },
            { index: 0, isHardened: true },
          ],
        },
      ],
    },
  },
  {
    name: 'invalid derivation path in array (depth:4)',
    ...commonParams,
    params: {
      walletId: new Uint8Array([10]),
      derivationPaths: [
        {
          path: [
            { index: 44, isHardened: true },
            { index: 0, isHardened: true },
            { index: 0, isHardened: true },
            { index: 0, isHardened: false },
          ],
        },
      ],
    },
  },
];

export default invalidArgs;
