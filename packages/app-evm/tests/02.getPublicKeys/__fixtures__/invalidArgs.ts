import { IGetPublicKeysTestCase } from './types';

const commonParams = {
  queries: [{ name: 'empty', data: new Uint8Array([]) }],
  results: [{ name: 'empty', data: new Uint8Array([]) }],
  errorInstance: Error,
  errorMessage: /AssertionError/,
};

const validParams = {
  walletId: new Uint8Array([
    199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
    110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
    64,
  ]),
  derivationPaths: [
    {
      path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
    },
  ],
  chainId: '1',
};

const invalidArgs: IGetPublicKeysTestCase[] = [
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
    params: { ...validParams, derivationPaths: undefined } as any,
  },
  {
    name: 'No wallet id',
    ...commonParams,
    params: { ...validParams, walletId: undefined } as any,
  },
  {
    name: 'No chain id',
    ...commonParams,
    params: { ...validParams, chainId: undefined } as any,
  },
  {
    name: 'Empty derivation path',
    ...commonParams,
    params: {
      ...validParams,
      derivationPaths: [],
    } as any,
  },
  {
    name: 'invalid derivation path in array (depth:2)',
    ...commonParams,
    params: {
      ...validParams,
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
];

export default invalidArgs;
