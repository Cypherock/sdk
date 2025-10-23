import { hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

const realSiaTransactionBlob =
  '0100000000000000b4e06bc83993cb0b99d7f63b91e3736df3400f0952f77ed527d020ad997d48f40200000000000000e62a389672890ed147593075ebe21385dd1a813209dec2c7375b38c9da342f420000f0e61aa34caa8f45080000000000a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa008065f4245606983449e300000000000000d01309468e150100000000000000';

const realSiaSignature =
  '0822ef5819b5f2286dc1ac68c83837c77ffcd9259b4c1abe4ec776f9fa33a501e9991d9b0cfc6f73072881d994d9f373abb3e1e301297de4f1d189cb82a10f0b';

const siaTransactionSigning: ISignTxnTestCase = {
  name: 'Sia transaction signing',
  params: {
    walletId: new Uint8Array([
      166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217, 116,
      107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58, 1, 150, 199,
    ]),
    derivationPath: [0],
    txn: {
      blob: realSiaTransactionBlob,
    },
  },
  queries: [
    {
      name: 'Initiate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217,
              116, 107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58,
              1, 150, 199,
            ]),
            derivationPath: [0],
            transactionSize: Buffer.from(realSiaTransactionBlob, 'hex').length,
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
              chunk: new Uint8Array(Buffer.from(realSiaTransactionBlob, 'hex')),
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
            signature: hexToUint8Array(realSiaSignature),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature: realSiaSignature,
  },
};

const siaTransactionSigningIndex1: ISignTxnTestCase = {
  name: 'Sia transaction signing with index 1',
  params: {
    walletId: new Uint8Array([
      166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217, 116,
      107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58, 1, 150, 199,
    ]),
    derivationPath: [1],
    txn: {
      blob: realSiaTransactionBlob,
    },
  },
  queries: [
    {
      name: 'Initiate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217,
              116, 107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58,
              1, 150, 199,
            ]),
            derivationPath: [1],
            transactionSize: Buffer.from(realSiaTransactionBlob, 'hex').length,
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
              chunk: new Uint8Array(Buffer.from(realSiaTransactionBlob, 'hex')),
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
              'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', // Mock signature for index 1
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature:
      'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  },
};

const valid: ISignTxnTestCase[] = [
  siaTransactionSigning,
  siaTransactionSigningIndex1,
];

export default valid;
