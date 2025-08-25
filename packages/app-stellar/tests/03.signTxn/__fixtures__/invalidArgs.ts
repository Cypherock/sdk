import { ISignTxnTestCase } from './types';

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
  derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED: 3 elements for Stellar
  txn: {
    xdr: 'AAAAAgAAAABt7324zmZ7Qs3TJ9Ug7QWX8Qx3vx5ld9CZ8t6KGVNa8AAAA+gAAAFmAAAAAQAAAAEAAAAAAAAAAAAAAABk4LTWAAAAAAAAAAEAAAAAAAAADgAAAAFYTEGQQ5QAA+gAAAFmAAAAAAAAAAEAAAAAAAAAAQAAAABt7324zmZ7Qs3TJ9Ug7QWX8Qx3vx5ld9CZ8t6KGVNa8AAAAAAAAAAAAmJaAAAAAAAAAFEAAAAAAA==',
    networkPassphrase: 'Test SDF Network ; September 2015',
  },
};

const invalidArgs: ISignTxnTestCase[] = [
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
    name: 'No txn',
    ...commonParams,
    params: { ...validParams, txn: undefined } as any,
  },
  {
    name: 'No xdr',
    ...commonParams,
    params: {
      ...validParams,
      txn: { ...validParams.txn, xdr: undefined },
    } as any,
  },
  {
    name: 'No network passphrase',
    ...commonParams,
    params: {
      ...validParams,
      txn: { ...validParams.txn, networkPassphrase: undefined },
    } as any,
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
    name: 'Invalid derivation path length (5 elements like XRP)',
    ...commonParams,
    params: {
      ...validParams,
      derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000, 0, 0], // 5 elements (should fail for Stellar)
    } as any,
  },
  {
    name: 'invalid derivation path in array (depth:2)',
    ...commonParams,
    params: {
      ...validParams,
      derivationPath: [
        { index: 44, isHardened: true },
        { index: 148, isHardened: true }, //  Stellar coin type
      ],
    },
  },
];

export default invalidArgs;
