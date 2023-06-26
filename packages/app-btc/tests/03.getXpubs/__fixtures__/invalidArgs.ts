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
          path: [0x80000000 + 44, 0x80000000, 0x80000000],
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
          path: [0x80000000 + 44, 0x80000000],
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
          path: [0x80000000 + 44, 0x80000000, 0x80000000, 0x80000000],
        },
      ],
    },
  },
];

export default invalidArgs;
