import { ISignTxnTestCase } from './types';

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
  derivationPath: [0],
  txn: {
    blob: '0100000000000000b4e06bc83993cb0b99d7f63b91e3736df3400f0952f77ed527d020ad997d48f40200000000000000e62a389672890ed147593075ebe21385dd1a813209dec2c7375b38c9da342f420000f0e61aa34caa8f45080000000000a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa008065f4245606983449e300000000000000d01309468e150100000000000000',
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
    params: undefined as any,
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
    name: 'No blob',
    ...commonParams,
    params: {
      ...validParams,
      txn: { ...validParams.txn, blob: undefined },
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
    name: 'Invalid derivation path - too many elements',
    ...commonParams,
    params: {
      ...validParams,
      derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0],
    } as any,
  },
  {
    name: 'Invalid derivation path - negative number',
    ...commonParams,
    params: {
      ...validParams,
      derivationPath: [-1],
    } as any,
  },
  {
    name: 'Invalid blob - not hex string',
    ...commonParams,
    params: {
      ...validParams,
      txn: { blob: 'not-hex-string' },
    } as any,
    errorMessage: /Invalid|result|device/,
  },
  {
    name: 'Invalid blob - not string',
    ...commonParams,
    params: {
      ...validParams,
      txn: { blob: 123 },
    } as any,
    errorMessage: /Invalid|result|device|should be.*string/,
  },
];

export default invalidArgs;
