import { hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

// Sample Stellar XDR transaction for testing
const sampleStellarXDR =
  'AAAAAgAAAABt7324zmZ7Qs3TJ9Ug7QWX8Qx3vx5ld9CZ8t6KGVNa8AAAA+gAAAFmAAAAAQAAAAEAAAAAAAAAAAAAAABk4LTWAAAAAAAAAAEAAAAAAAAADgAAAAFYTEGQQ5QAA+gAAAFmAAAAAAAAAAEAAAAAAAAAAQAAAABt7324zmZ7Qs3TJ9Ug7QWX8Qx3vx5ld9CZ8t6KGVNa8AAAAAAAAAAAAmJaAAAAAAAAAFEAAAAAAA==';

const stellarTransferWithSerialize: ISignTxnTestCase = {
  name: 'Stellar transfer with serialize',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED: 3 elements for Stellar
    serializeTxn: true,
    txn: {
      xdr: sampleStellarXDR,
      networkPassphrase: 'Test SDF Network ; September 2015', // Stellar testnet
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
            derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED
            transactionSize: Buffer.from(sampleStellarXDR, 'base64').length,
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
              chunk: Buffer.from(sampleStellarXDR, 'base64'),
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
              'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef', // 64-byte Ed25519 signature
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature:
      'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef',
    serializedTxn: sampleStellarXDR, // FIXED: Expect the actual serialized transaction when serializeTxn is true
  },
};

const stellarTransferWithoutSerialize: ISignTxnTestCase = {
  name: 'Stellar transfer without serialize',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED: 3 elements for Stellar
    txn: {
      xdr: sampleStellarXDR,
      networkPassphrase: 'Test SDF Network ; September 2015',
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
            derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED
            transactionSize: Buffer.from(sampleStellarXDR, 'base64').length,
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
              chunk: Buffer.from(sampleStellarXDR, 'base64'),
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
              'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature:
      'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef',
    // No serializedTxn property when serializeTxn is false (undefined by default)
  },
};

const valid: ISignTxnTestCase[] = [
  stellarTransferWithSerialize,
  stellarTransferWithoutSerialize,
];

export default valid;