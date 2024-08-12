import { IEncryptMessagesTestCase } from './types';

const commonParams = {
  queries: [{ name: 'empty', data: new Uint8Array([]) }],
  results: [{ name: 'empty', data: new Uint8Array([]) }],
  errorInstance: Error,
  errorMessage: /AssertionError/,
};

const validParams = {
  walletId: new Uint8Array([
    199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
    110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
  ]),
  messages: [
    { value: 'test' },
    { value: 'something else' },
    { value: 'something other than something else', isPrivate: true },
  ],
};

const invalidArgs: IEncryptMessagesTestCase[] = [
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
    name: 'No wallet id',
    ...commonParams,
    params: { ...validParams, walletId: undefined } as any,
  },
  {
    name: 'Invalid wallet id',
    ...commonParams,
    params: { ...validParams, walletId: [0] } as any,
  },
  {
    name: 'No messages',
    ...commonParams,
    params: { ...validParams, messages: undefined } as any,
  },
  {
    name: 'Empty messages',
    ...commonParams,
    params: {
      ...validParams,
      messages: [],
    } as any,
  },
  {
    name: 'Invalid messages',
    ...commonParams,
    params: { ...validParams, messages: [{ random: 'value' }] } as any,
  },
];

export default invalidArgs;
