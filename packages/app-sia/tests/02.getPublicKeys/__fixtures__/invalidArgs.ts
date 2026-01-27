import { IGetPublicKeysTestCase } from './types';

const commonParams = {
  queries: [{ name: 'empty', data: new Uint8Array([]) }],
  results: [{ name: 'empty', data: new Uint8Array([]) }],
  errorInstance: Error,
  errorMessage: /AssertionError/,
};

const validParams = {
  walletId: new Uint8Array([
    166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217, 116, 107,
    202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58, 1, 150, 199,
  ]),
  derivationPaths: [
    {
      path: [0],
    },
  ],
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
    params: undefined as any,
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
    name: 'Empty derivation path',
    ...commonParams,
    params: {
      ...validParams,
      derivationPaths: [],
    } as any,
  },
  {
    name: 'Invalid derivation path - too many elements',
    ...commonParams,
    params: {
      ...validParams,
      derivationPaths: [
        {
          path: [44, 148, 0],
        },
      ],
    },
  },
  {
    name: 'Invalid derivation path - negative number',
    ...commonParams,
    params: {
      ...validParams,
      derivationPaths: [
        {
          path: [-1], // Negative index - invalid
        },
      ],
    },
  },
];

export default invalidArgs;
