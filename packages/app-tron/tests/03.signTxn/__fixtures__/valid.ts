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
    serializeTxn: true,
    txn: {
      txID: 'ae9595f76c538df617834f2a82e474ffd80ec67b378b7758856ff3730737d2ba',
      raw_data: {
        contract: [
          {
            parameter: {
              value: {
                amount: 5,
                owner_address: '41e4a7664b2dbcb2fdcc7f1e40bc17549b438aaef3',
                to_address: '41281ad562a89aa2f777ea0c688ceda306e5ec9874',
              },
              type_url: 'type.googleapis.com/protocol.TransferContract',
            },
            type: 'TransferContract',
          },
        ],
        ref_block_bytes: '6545',
        ref_block_hash: '9c1b7e8ed8f70f73',
        expiration: 1718876028000,
        timestamp: 1718875970281,
      },
      raw_data_hex:
        '0a02654522089c1b7e8ed8f70f7340e0f8faa783325a65080112610a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412300a1541e4a7664b2dbcb2fdcc7f1e40bc17549b438aaef3121541281ad562a89aa2f777ea0c688ceda306e5ec9874180570e9b5f7a78332',
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
              0x80000000 + 195,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 131,
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
                '0a02654522089c1b7e8ed8f70f7340e0f8faa783325a65080112610a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412300a1541e4a7664b2dbcb2fdcc7f1e40bc17549b438aaef3121541281ad562a89aa2f777ea0c688ceda306e5ec9874180570e9b5f7a78332',
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
    signedTransaction: {
      txID: 'ae9595f76c538df617834f2a82e474ffd80ec67b378b7758856ff3730737d2ba',
      raw_data: {
        contract: [
          {
            parameter: {
              value: {
                amount: 5,
                owner_address: '41e4a7664b2dbcb2fdcc7f1e40bc17549b438aaef3',
                to_address: '41281ad562a89aa2f777ea0c688ceda306e5ec9874',
              },
              type_url: 'type.googleapis.com/protocol.TransferContract',
            },
            type: 'TransferContract',
          },
        ],
        ref_block_bytes: '6545',
        ref_block_hash: '9c1b7e8ed8f70f73',
        expiration: 1718876028000,
        timestamp: 1718875970281,
      },
      signature: [
        '13c313e046dfcae5b39545b73d8deedffc8bef138007c3bf2b2aa99dd6cee40d43d56a6069678750e5212c1bad25b6caa623a6571d7337275678ec9645b81bfe00',
      ],
      raw_data_hex:
        '0a02654522089c1b7e8ed8f70f7340e0f8faa783325a65080112610a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412300a1541e4a7664b2dbcb2fdcc7f1e40bc17549b438aaef3121541281ad562a89aa2f777ea0c688ceda306e5ec9874180570e9b5f7a78332',
    },
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
    serializeTxn: true,
    txn: {
      txID: 'ec4be93f36057767d839174e48ef75d50be8ed9c02b8d1ef0e4313f16d19cf60',
      raw_data: {
        contract: [
          {
            parameter: {
              value: {
                data: 'a9059cbb000000000000000000000000e270dce70e8b4bbb61f7ca02c96ecdb44f92c5c80000000000000000000000000000000000000000000000000000000000f42400',
                owner_address: '412d3ad4f4398a4b7401d5c3d2c7a5292991f743ff',
                contract_address: '41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
              },
              type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
            },
            type: 'TriggerSmartContract',
          },
        ],
        ref_block_bytes: '6545',
        ref_block_hash: '9c1b7e8ed8f70f73',
        expiration: 1718876028000,
        fee_limit: 40000000,
        timestamp: 1718875970525,
      },
      raw_data_hex:
        '0a02654522089c1b7e8ed8f70f7340e0f8faa783325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15412d3ad4f4398a4b7401d5c3d2c7a5292991f743ff121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244a9059cbb000000000000000000000000e270dce70e8b4bbb61f7ca02c96ecdb44f92c5c80000000000000000000000000000000000000000000000000000000000f4240070ddb7f7a78332900180b48913',
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
                '0a02654522089c1b7e8ed8f70f7340e0f8faa783325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15412d3ad4f4398a4b7401d5c3d2c7a5292991f743ff121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244a9059cbb000000000000000000000000e270dce70e8b4bbb61f7ca02c96ecdb44f92c5c80000000000000000000000000000000000000000000000000000000000f4240070ddb7f7a78332900180b48913',
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
    signedTransaction: {
      txID: 'ec4be93f36057767d839174e48ef75d50be8ed9c02b8d1ef0e4313f16d19cf60',
      raw_data: {
        contract: [
          {
            parameter: {
              value: {
                data: 'a9059cbb000000000000000000000000e270dce70e8b4bbb61f7ca02c96ecdb44f92c5c80000000000000000000000000000000000000000000000000000000000f42400',
                owner_address: '412d3ad4f4398a4b7401d5c3d2c7a5292991f743ff',
                contract_address: '41a614f803b6fd780986a42c78ec9c7f77e6ded13c',
              },
              type_url: 'type.googleapis.com/protocol.TriggerSmartContract',
            },
            type: 'TriggerSmartContract',
          },
        ],
        ref_block_bytes: '6545',
        ref_block_hash: '9c1b7e8ed8f70f73',
        expiration: 1718876028000,
        fee_limit: 40000000,
        timestamp: 1718875970525,
      },
      raw_data_hex:
        '0a02654522089c1b7e8ed8f70f7340e0f8faa783325aae01081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a15412d3ad4f4398a4b7401d5c3d2c7a5292991f743ff121541a614f803b6fd780986a42c78ec9c7f77e6ded13c2244a9059cbb000000000000000000000000e270dce70e8b4bbb61f7ca02c96ecdb44f92c5c80000000000000000000000000000000000000000000000000000000000f4240070ddb7f7a78332900180b48913',
      signature: [
        '65cb88aba8783553ce17b8e87a61979523ab3c2ec5ca9445aaf81ddc15d29e09494287de6fe05cae31f2fed96bbe3dcf5cfdea98c8322caa2b8d50421ddc3ebc01',
      ],
    },
  },
};

const valid: ISignTxnTestCase[] = [trxTransfer, trc20Transfer];

export default valid;
