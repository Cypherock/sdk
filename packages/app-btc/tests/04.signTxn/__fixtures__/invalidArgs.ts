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
  derivationPath: [
    { index: 44, isHardened: true },
    { index: 0, isHardened: true },
    { index: 0, isHardened: true },
  ],
  txn: {
    inputs: [
      {
        prevIndex: 1,
        prevTxnHash:
          'a99155df72ea86ca6be1c9d039ade79e6feb7c4f5904f12b4b168b7416a22fd9',
        prevTxn:
          '0200000000010211f852bd83a5ba61877026abda944b419d05c4768df7005a8b8f6cae14e4a57f2600000000fffffffff1ba6c76c0e31ef0b3cbf605d89b523c5bef16a58ec4cfb2550f49a4108aff4f0100000000ffffffff02cda4130000000000160014826979058429649e3160783f8c03c480f98329bb8b8236000000000017a9143291522f1cd6699e8a076a7618da8fa0d68c40e98702483045022100f25f539965a10312dd6657d21c43872618fbab3a2bc6a665192735e5e19b080c022038a8e186621abc01a90e735d50e967e1485f12793a8c10e8ea4a56dc5dca619b0121034ee63fbc1dd72c317179ae76597bd28e8b3fca1c6238760f8fc9bcc1a6b0630802483045022100a5094498a19913bbf1bb9ca129d700b771d637f1cfd46ff419ac0188ad6376c50220346f23f281990f1aaf833c406f23f8439f561a11657310a97a371ee6191c020401210235ec79fc08cf43f6e470e8526ba70c0e92eb65d917f266210eb5a2b4e9eb942400000000',

        value: '3572363',
        scriptPubKey: '1600141085e0eb5e344427e7bf622d4d3bf2c51709c31b',

        chainIndex: 0,
        addressIndex: 10,
        sequence: 0xffffffff,
      },
    ],
    outputs: [
      {
        value: '3547271',
        scriptPubKey: '001402d8a4c57953b86fb39d47be9d95bae1eb756ece',
        isChange: false,
      },
    ],
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
    name: 'No derivation paths',
    ...commonParams,
    params: { ...validParams, derivationPath: undefined } as any,
  },
  {
    name: 'No wallet id',
    ...commonParams,
    params: { ...validParams, walletId: undefined } as any,
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
    name: 'invalid derivation path in array (depth:4)',
    ...commonParams,
    params: {
      ...validParams,
      derivationPath: [
        { index: 44, isHardened: true },
        { index: 0, isHardened: true },
        { index: 0, isHardened: true },
        { index: 0, isHardened: false },
      ],
    },
  },
  {
    name: 'no txn',
    ...commonParams,
    params: {
      ...validParams,
      txn: undefined,
    },
  },
  {
    name: 'no inputs',
    ...commonParams,
    params: {
      ...validParams,
      txn: { ...validParams.txn, inputs: [] },
    },
  },
  {
    name: 'no outputs',
    ...commonParams,
    params: {
      ...validParams,
      txn: { ...validParams.txn, outputs: [] },
    },
  },
];

export default invalidArgs;