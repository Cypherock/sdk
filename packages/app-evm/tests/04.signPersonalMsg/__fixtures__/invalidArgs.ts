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
  derivationPath: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
  message:
    '0x74657374696e67207465787420666f72207369676e696e6720706572736f6e616c206d657373616765',
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
  {
    name: 'invalid message hex',
    ...commonParams,
    params: {
      ...validParams,
      message: '0x214s',
    },
  },
];

export default invalidArgs;
