import { hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

const xrpTransferWithSerialize: ISignTxnTestCase = {
  name: 'Xrp transfer',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 0],
    serializeTxn: true,
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
  },
  queries: [
    {
      name: 'Initate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
              233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128,
              26, 3, 187, 121, 64,
            ]),
            derivationPath: [
              0x80000000 + 44,
              0x80000000 + 144,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 120,
          },
        },
      }),
    },
    {
      name: 'Txn data chunk payload',
      data: queryToUint8Array({
        signTxn: {
          txnData: {
            chunkPayload: {
              chunk: hexToUint8Array(
                '53545800120000220000000024000A5342201B0012E57C6140000000004C4B4068400000000000000C7321027497533006D024FFB612A2110EB327CCFEED2B752D787C96AB2D3CCA425A40E88114FF2BC637244009494C6203505254126638AAD7CD8314A0F766DFCC0B5DDC91E7679C7539590983A41D9F',
              ),
              chunkIndex: 0,
              totalChunks: 1,
              remainingSize: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Signature request',
      data: queryToUint8Array({
        signTxn: {
          signature: {},
        },
      }),
    },
  ],
  results: [
    {
      name: 'Confirmation',
      data: resultToUint8Array({
        signTxn: {
          confirmation: {},
        },
      }),
    },
    {
      name: 'Data accepted',
      data: resultToUint8Array({
        signTxn: {
          dataAccepted: { chunkAck: { chunkIndex: 0 } },
        },
      }),
    },
    {
      name: 'Signature',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              '304402202b1341dda956b8e7843015c3246e7b909cdd00accc28954653760f5483044f9d02204bad75aa489fa162c281082e5cf07afe3f094551b9155753f2ba18937d43e3c4',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature:
      '304402202b1341dda956b8e7843015c3246e7b909cdd00accc28954653760f5483044f9d02204bad75aa489fa162c281082e5cf07afe3f094551b9155753f2ba18937d43e3c4',
    serializedTxn:
      '120000220000000024000A5342201B0012E57C6140000000004C4B4068400000000000000C7321027497533006D024FFB612A2110EB327CCFEED2B752D787C96AB2D3CCA425A40E87446304402202B1341DDA956B8E7843015C3246E7B909CDD00ACCC28954653760F5483044F9D02204BAD75AA489FA162C281082E5CF07AFE3F094551B9155753F2BA18937D43E3C48114FF2BC637244009494C6203505254126638AAD7CD8314A0F766DFCC0B5DDC91E7679C7539590983A41D9F',
  },
};

const xrpTransferWithoutSerialize: ISignTxnTestCase = {
  name: 'Xrp transfer',
  params: {
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
  },
  queries: [
    {
      name: 'Initate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
              233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128,
              26, 3, 187, 121, 64,
            ]),
            derivationPath: [
              0x80000000 + 44,
              0x80000000 + 144,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 120,
          },
        },
      }),
    },
    {
      name: 'Txn data chunk payload',
      data: queryToUint8Array({
        signTxn: {
          txnData: {
            chunkPayload: {
              chunk: hexToUint8Array(
                '53545800120000220000000024000A5342201B0012E57C6140000000004C4B4068400000000000000C7321027497533006D024FFB612A2110EB327CCFEED2B752D787C96AB2D3CCA425A40E88114FF2BC637244009494C6203505254126638AAD7CD8314A0F766DFCC0B5DDC91E7679C7539590983A41D9F',
              ),
              chunkIndex: 0,
              totalChunks: 1,
              remainingSize: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Signature request',
      data: queryToUint8Array({
        signTxn: {
          signature: {},
        },
      }),
    },
  ],
  results: [
    {
      name: 'Confirmation',
      data: resultToUint8Array({
        signTxn: {
          confirmation: {},
        },
      }),
    },
    {
      name: 'Data accepted',
      data: resultToUint8Array({
        signTxn: {
          dataAccepted: { chunkAck: { chunkIndex: 0 } },
        },
      }),
    },
    {
      name: 'Signature',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              '304402202b1341dda956b8e7843015c3246e7b909cdd00accc28954653760f5483044f9d02204bad75aa489fa162c281082e5cf07afe3f094551b9155753f2ba18937d43e3c4',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature:
      '304402202b1341dda956b8e7843015c3246e7b909cdd00accc28954653760f5483044f9d02204bad75aa489fa162c281082e5cf07afe3f094551b9155753f2ba18937d43e3c4',
  },
};

const valid: ISignTxnTestCase[] = [
  xrpTransferWithSerialize,
  xrpTransferWithoutSerialize,
];

export default valid;
