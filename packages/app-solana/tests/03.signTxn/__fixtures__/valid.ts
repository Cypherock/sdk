import { hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

const sendWithSerialize: ISignTxnTestCase = {
  name: 'Solana transfer',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 501, 0x80000000],
    txn: '010001031be0085a98d799ea6facc190a95b5be7a7f2d95cff4826969b477f4dca875c08ae0bd6e8b5b56d580baefb64f6f52260ee8f9983b7f8fd61f526a30d6f5ff52900000000000000000000000000000000000000000000000000000000000000006540dea139d4c66db55b927a9e2c5f584f23bb35048e937fddae551af08fbc9c01020200010c0200000080841e0000000000',
    serializeTxn: true,
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
            derivationPath: [0x80000000 + 44, 0x80000000 + 501, 0x80000000],
            transactionSize: 150,
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
                '010001031be0085a98d799ea6facc190a95b5be7a7f2d95cff4826969b477f4dca875c08ae0bd6e8b5b56d580baefb64f6f52260ee8f9983b7f8fd61f526a30d6f5ff52900000000000000000000000000000000000000000000000000000000000000006540dea139d4c66db55b927a9e2c5f584f23bb35048e937fddae551af08fbc9c01020200010c0200000080841e0000000000',
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
      name: 'Verify request',
      data: queryToUint8Array({
        signTxn: {
          verify: {},
        },
      }),
    },
    {
      name: 'Signature request',
      data: queryToUint8Array({
        signTxn: {
          signature: {
            blockhash: hexToUint8Array(
              '05449b5db66d40f652205af8d8cc05b88c7158d6b14bdfe24137c868690d29da',
            ),
          },
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
      name: 'Verified',
      data: resultToUint8Array({
        signTxn: {
          verify: {},
        },
      }),
    },
    {
      name: 'Signature',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              'fc6a1780ad15dd1e6dc73b45e178d69e61815f64a50c31fe260e1d3d2153794ec7f032feb0e686c0345500b2f6dbc905f3761dc6e9091c1b1a01b7aad9ce1907',
            ),
          },
        },
      }),
    },
  ],
  mocks: {
    eventCalls: [[0], [1], [2], [3], [4]],
    latestBlockHash: 'MZiTWj9XuNLnH6p863EraYnUFEwsQc9NKn5gK9ArKhB',
  },
  output: {
    signature:
      'fc6a1780ad15dd1e6dc73b45e178d69e61815f64a50c31fe260e1d3d2153794ec7f032feb0e686c0345500b2f6dbc905f3761dc6e9091c1b1a01b7aad9ce1907',
    serializedTxn:
      '6VzjLj5zNVEV62esGoZTKqukCDWv6CVMy6MusRZDK1Rm59cU6WtvKShs2Q3TwAuaE2xAr4akDsdDyKAQXa4HUK3tfNZzzt1TS8JfVpHQPYfZsbvRd2SXbAfgtCJbc7Aa5QsUqVFScknw1VECkKeFZoh5hE9ASCXJHkg5XkcVpfTVu86kkJExFsNbBah1rwVmtFMttXUrahtPLRmfjtzHbb8qgt3LyYHUaRpXRj2ciRh74pB5i6V3Fakswt6zsj8r4ccm5TudVvmCoDqaH5BkdWDT7393rqnrV8zKq',
    serializedTxnHex:
      '01fc6a1780ad15dd1e6dc73b45e178d69e61815f64a50c31fe260e1d3d2153794ec7f032feb0e686c0345500b2f6dbc905f3761dc6e9091c1b1a01b7aad9ce1907010001031be0085a98d799ea6facc190a95b5be7a7f2d95cff4826969b477f4dca875c08ae0bd6e8b5b56d580baefb64f6f52260ee8f9983b7f8fd61f526a30d6f5ff529000000000000000000000000000000000000000000000000000000000000000005449b5db66d40f652205af8d8cc05b88c7158d6b14bdfe24137c868690d29da01020200010c0200000080841e0000000000',
  },
};

const valid: ISignTxnTestCase[] = [sendWithSerialize];

export default valid;
