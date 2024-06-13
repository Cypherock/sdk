import { createFlowStatus, hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

const trxTransfer: ISignTxnTestCase = {
  name: 'Trx transfer',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
    txn: '0a027e4222084fec2812035213f34098a5ce9081325a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a1541f91fe3897cb65ba46ca0b88763fe5d0735e897f9121541d0f413cc7632d9a86599b5ccf8da0a162fa19f1d18defde43670b89aee8a8132',
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
              0x80000000 + 195,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 134,
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
                '0a027e4222084fec2812035213f34098a5ce9081325a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a1541f91fe3897cb65ba46ca0b88763fe5d0735e897f9121541d0f413cc7632d9a86599b5ccf8da0a162fa19f1d18defde43670b89aee8a8132',
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
              '13c313e046dfcae5b39545b73d8deedffc8bef138007c3bf2b2aa99dd6cee40d43d56a6069678750e5212c1bad25b6caa623a6571d7337275678ec9645b81bfe00',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature:
      '13c313e046dfcae5b39545b73d8deedffc8bef138007c3bf2b2aa99dd6cee40d43d56a6069678750e5212c1bad25b6caa623a6571d7337275678ec9645b81bfe00',
  },
};

const trc20Transfer: ISignTxnTestCase = {
  name: 'TRC20 transfer',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
    txn: '0a028080220820c02f0f4276d6804090a2bf9181325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541f91fe3897cb65ba46ca0b88763fe5d0735e897f9121541ea51342dabbb928ae1e576bd39eff8aaf070a8c62244a9059cbb000000000000000000000000f259532c60a1608296272973803c291d27fb33c4000000000000000000000000000000000000000000000000000000006bd869e870e0a2df8b8132900180c2d72f',
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
              0x80000000 + 195,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 211,
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
                '0a028080220820c02f0f4276d6804090a2bf9181325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541f91fe3897cb65ba46ca0b88763fe5d0735e897f9121541ea51342dabbb928ae1e576bd39eff8aaf070a8c62244a9059cbb000000000000000000000000f259532c60a1608296272973803c291d27fb33c4000000000000000000000000000000000000000000000000000000006bd869e870e0a2df8b8132900180c2d72f',
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
      statuses: [
        {
          flowStatus: createFlowStatus(0, 0),
          expectEventCalls: [0],
        },
        {
          flowStatus: createFlowStatus(1, 0),
          expectEventCalls: [1],
        },
        {
          flowStatus: createFlowStatus(2, 0),
          expectEventCalls: [2],
        },
      ],
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
      name: 'Signature response',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              '65cb88aba8783553ce17b8e87a61979523ab3c2ec5ca9445aaf81ddc15d29e09494287de6fe05cae31f2fed96bbe3dcf5cfdea98c8322caa2b8d50421ddc3ebc01',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    signature:
      '65cb88aba8783553ce17b8e87a61979523ab3c2ec5ca9445aaf81ddc15d29e09494287de6fe05cae31f2fed96bbe3dcf5cfdea98c8322caa2b8d50421ddc3ebc01',
  },
};

const valid: ISignTxnTestCase[] = [trxTransfer, trc20Transfer];

export default valid;
