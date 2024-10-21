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
  derivationPath: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 0],
  txn: {
    rawTxn: {
      TransactionType: 'Payment',
      Account: 'rQGDkQchoJxMSLZR7q9GwvY3iKtDqTUYNQ',
      Amount: '5000000',
      Destination: 'rEgfV7YeyG4YayQQufxaqDx4aUA93SidLb',
      Flags: 0,
      NetworkID: undefined,
      Sequence: 676674,
      Fee: '12',
      LastLedgerSequence: 1238396,
      SigningPubKey:
        '027497533006d024ffb612a2110eb327ccfeed2b752d787c96ab2d3cca425a40e8',
    },
    txnHex:
      '53545800120000220000000024000A5342201B0012E57C6140000000004C4B4068400000000000000C7321027497533006D024FFB612A2110EB327CCFEED2B752D787C96AB2D3CCA425A40E88114FF2BC637244009494C6203505254126638AAD7CD8314A0F766DFCC0B5DDC91E7679C7539590983A41D9F',
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
    name: 'No raw txn',
    ...commonParams,
    params: {
      ...validParams,
      txn: { ...validParams.txn, rawTxn: undefined },
    } as any,
  },
  {
    name: 'No txn hex',
    ...commonParams,
    params: {
      ...validParams,
      txn: { ...validParams.txn, txnHex: undefined },
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
