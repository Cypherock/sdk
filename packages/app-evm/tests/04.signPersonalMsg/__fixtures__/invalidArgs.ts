import { ISignPersonalMsgTestCase } from './types';

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
  derivationPath: [
    { index: 44, isHardened: true },
    { index: 60, isHardened: true },
    { index: 0, isHardened: true },
    { index: 0, isHardened: false },
    { index: 0, isHardened: false },
  ],
  message: new Uint8Array([
    116, 101, 115, 116, 105, 110, 103, 32, 116, 101, 120, 116, 32, 102, 111,
    114, 32, 115, 105, 103, 110, 105, 110, 103, 32, 112, 101, 114, 115, 111,
    110, 97, 108, 32, 109, 101, 115, 115, 97, 103, 101,
  ]),
};

const invalidArgs: ISignPersonalMsgTestCase[] = [
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
    params: { ...validParams, derivationPath: undefined } as any,
  },
  {
    name: 'No wallet id',
    ...commonParams,
    params: { ...validParams, walletId: undefined } as any,
  },
  {
    name: 'No message',
    ...commonParams,
    params: { ...validParams, message: undefined } as any,
  },
  {
    name: 'Empty derivation path',
    ...commonParams,
    params: {
      ...validParams,
      derivationPath: [],
    } as any,
  },
  {
    name: 'invalid derivation path in array (depth:2)',
    ...commonParams,
    params: {
      ...validParams,
      derivationPath: [
        { index: 44, isHardened: true },
        { index: 0, isHardened: true },
      ],
    },
  },
];

export default invalidArgs;
