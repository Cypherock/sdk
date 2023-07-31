import { hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

const withOneInput: ISignTxnTestCase = {
  name: 'With 1 input',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
    txn: {
      inputs: [
        {
          prevIndex: 1,
          prevTxnHash:
            'a99155df72ea86ca6be1c9d039ade79e6feb7c4f5904f12b4b168b7416a22fd9',
          value: '3572363',
          scriptPubKey: '1600141085e0eb5e344427e7bf622d4d3bf2c51709c31b',
          chainIndex: 0,
          addressIndex: 10,
          sequence: 0xffffffff,
        },
      ],
      rawTxn: ['0000'],
      outputs: [
        {
          value: '3547271',
          scriptPubKey: '001402d8a4c57953b86fb39d47be9d95bae1eb756ece',
          isChange: false,
        },
      ],
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
            derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
          },
        },
      }),
    },
    {
      name: 'Send meta',
      data: queryToUint8Array({
        signTxn: {
          meta: {
            version: 2,
            locktime: 0,
            inputCount: 1,
            outputCount: 1,
            sighash: 1,
          },
        },
      }),
    },
    {
      name: 'Input 1',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxnHash: hexToUint8Array(
              'a99155df72ea86ca6be1c9d039ade79e6feb7c4f5904f12b4b168b7416a22fd9',
            ),
            prevOutputIndex: 1,
            scriptPubKey: hexToUint8Array(
              '1600141085e0eb5e344427e7bf622d4d3bf2c51709c31b',
            ),
            value: '3572363',
            sequence: 0xffffffff,
            changeIndex: 0,
            addressIndex: 10,
          },
        },
      }),
    },
    {
      name: 'Raw Txn 1',
      data: queryToUint8Array({
        signTxn: {
          rawTxn: {
            chunkPayload: {
              chunk: hexToUint8Array('0000'),
              chunkIndex: 0,
              totalChunks: 1,
              remainingSize: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Output 1',
      data: queryToUint8Array({
        signTxn: {
          output: {
            scriptPubKey: hexToUint8Array(
              '001402d8a4c57953b86fb39d47be9d95bae1eb756ece',
            ),
            value: '3547271',
            isChange: false,
          },
        },
      }),
    },
    {
      name: 'Signature request 1',
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
      data: new Uint8Array([26, 2, 10, 0]),
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'Meta Accepted',
      data: resultToUint8Array({
        signTxn: {
          metaAccepted: {},
        },
      }),
    },
    {
      name: 'Input accepted: 1',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Chunk accepted: 1',
      data: resultToUint8Array({
        signTxn: {
          rawTxn: {
            chunkAck: {
              chunkIndex: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Output accepted: 1',
      data: resultToUint8Array({
        signTxn: {
          outputAccepted: {},
        },
      }),
    },
    {
      name: 'Signature: 1',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            unlockingScript: hexToUint8Array(
              '30450221009f917ec789c8a41dbadcdf694a831963607685f396909082293a1ada460d434f0220265a91af4d2e01cb670d22749b300fc7ee0fab124e5bc9ec9f770ffc2032181901',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4], [5]] },
  output: {
    signatures: [
      '30450221009f917ec789c8a41dbadcdf694a831963607685f396909082293a1ada460d434f0220265a91af4d2e01cb670d22749b300fc7ee0fab124e5bc9ec9f770ffc2032181901',
    ],
  },
};

const withMultipleInputs: ISignTxnTestCase = {
  name: 'With multiple inputs and outputs',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
    txn: {
      locktime: 12,
      hashType: 2,
      inputs: [
        {
          prevIndex: 0,
          prevTxnHash:
            '1ac7346b1256ae92e619140e2e27cd4ce6e5e66a8948819d4d11a0c8a5c2e243',
          value: '2000000',
          scriptPubKey: '',

          chainIndex: 0,
          addressIndex: 15,
        },
        {
          prevIndex: 0,
          prevTxnHash:
            'e0beda6c1b3ee20e8d37cef25035baf7ceb95359b0915088dc3c8e400b62a4e9',
          value: '1994235',
          scriptPubKey: '',

          chainIndex: 0,
          addressIndex: 54,
        },
        {
          prevIndex: 1,
          prevTxnHash:
            '7774e05cd70c4c64abe48796295a143400c09f430645417937a9649f5329e531',
          value: '1960624',
          scriptPubKey: '',

          chainIndex: 1,
          addressIndex: 21,
        },
        {
          prevIndex: 3,
          prevTxnHash:
            '16447d5c065942eb1f6d2bb92c9c9411e2bcbeac3ca2c57bb26dab523af59297',
          value: '1894780',
          scriptPubKey: '',

          chainIndex: 1,
          addressIndex: 21,
        },
      ],
      rawTxn: ['0000', '0000', '0000', '0000'],
      outputs: [
        {
          value: '3810708',
          scriptPubKey: '0014840428016ac99287b5793d6775bedf8eb6ad6d59',
          isChange: false,
        },
        {
          value: '3637363',
          scriptPubKey: '0014f14099e64e8227701c500ca6e8711019bbac24fe',
          isChange: false,
        },
        {
          value: '382560',
          scriptPubKey: '00149e4280f5196acd95aafa3897d4a592ff3fc065ee',
          isChange: true,
          chainIndex: 1,
        },
      ],
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
            derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
          },
        },
      }),
    },
    {
      name: 'Send meta',
      data: queryToUint8Array({
        signTxn: {
          meta: {
            version: 2,
            locktime: 12,
            inputCount: 4,
            outputCount: 3,
            sighash: 2,
          },
        },
      }),
    },
    {
      name: 'Input 1',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxnHash: hexToUint8Array(
              '1ac7346b1256ae92e619140e2e27cd4ce6e5e66a8948819d4d11a0c8a5c2e243',
            ),
            prevOutputIndex: 0,
            scriptPubKey: hexToUint8Array(''),
            value: '2000000',
            sequence: 0xffffffff,
            changeIndex: 0,
            addressIndex: 15,
          },
        },
      }),
    },
    {
      name: 'Input 2',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxnHash: hexToUint8Array(
              'e0beda6c1b3ee20e8d37cef25035baf7ceb95359b0915088dc3c8e400b62a4e9',
            ),
            prevOutputIndex: 0,
            scriptPubKey: hexToUint8Array(''),
            value: '1994235',
            sequence: 0xffffffff,
            changeIndex: 0,
            addressIndex: 54,
          },
        },
      }),
    },
    {
      name: 'Input 3',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxnHash: hexToUint8Array(
              '7774e05cd70c4c64abe48796295a143400c09f430645417937a9649f5329e531',
            ),
            prevOutputIndex: 1,
            scriptPubKey: hexToUint8Array(''),
            value: '1960624',
            sequence: 0xffffffff,
            changeIndex: 1,
            addressIndex: 21,
          },
        },
      }),
    },
    {
      name: 'Input 4',
      data: queryToUint8Array({
        signTxn: {
          input: {
            prevTxnHash: hexToUint8Array(
              '16447d5c065942eb1f6d2bb92c9c9411e2bcbeac3ca2c57bb26dab523af59297',
            ),
            prevOutputIndex: 3,
            scriptPubKey: hexToUint8Array(''),
            value: '1894780',
            sequence: 0xffffffff,
            changeIndex: 1,
            addressIndex: 21,
          },
        },
      }),
    },
    {
      name: 'Raw Txn 1',
      data: queryToUint8Array({
        signTxn: {
          rawTxn: {
            chunkPayload: {
              chunk: hexToUint8Array('0000'),
              chunkIndex: 0,
              totalChunks: 1,
              remainingSize: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Raw Txn 2',
      data: queryToUint8Array({
        signTxn: {
          rawTxn: {
            chunkPayload: {
              chunk: hexToUint8Array('0000'),
              chunkIndex: 0,
              totalChunks: 1,
              remainingSize: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Raw Txn 3',
      data: queryToUint8Array({
        signTxn: {
          rawTxn: {
            chunkPayload: {
              chunk: hexToUint8Array('0000'),
              chunkIndex: 0,
              totalChunks: 1,
              remainingSize: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Raw Txn 4',
      data: queryToUint8Array({
        signTxn: {
          rawTxn: {
            chunkPayload: {
              chunk: hexToUint8Array('0000'),
              chunkIndex: 0,
              totalChunks: 1,
              remainingSize: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Output 1',
      data: queryToUint8Array({
        signTxn: {
          output: {
            scriptPubKey: hexToUint8Array(
              '0014840428016ac99287b5793d6775bedf8eb6ad6d59',
            ),
            value: '3810708',
            isChange: false,
          },
        },
      }),
    },
    {
      name: 'Output 2',
      data: queryToUint8Array({
        signTxn: {
          output: {
            scriptPubKey: hexToUint8Array(
              '0014f14099e64e8227701c500ca6e8711019bbac24fe',
            ),
            value: '3637363',
            isChange: false,
          },
        },
      }),
    },
    {
      name: 'Output 3',
      data: queryToUint8Array({
        signTxn: {
          output: {
            scriptPubKey: hexToUint8Array(
              '00149e4280f5196acd95aafa3897d4a592ff3fc065ee',
            ),
            value: '382560',
            isChange: true,
            changesIndex: 1,
          },
        },
      }),
    },
    {
      name: 'Signature request 1',
      data: queryToUint8Array({
        signTxn: {
          signature: {},
        },
      }),
    },
    {
      name: 'Signature request 2',
      data: queryToUint8Array({
        signTxn: {
          signature: {},
        },
      }),
    },
    {
      name: 'Signature request 3',
      data: queryToUint8Array({
        signTxn: {
          signature: {},
        },
      }),
    },
    {
      name: 'Signature request 4',
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
      data: new Uint8Array([26, 2, 10, 0]),
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'Meta Accepted',
      data: resultToUint8Array({
        signTxn: {
          metaAccepted: {},
        },
      }),
    },
    {
      name: 'Input request: 1',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Input request: 2',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Input request: 3',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Input request: 4',
      data: resultToUint8Array({
        signTxn: {
          inputAccepted: {},
        },
      }),
    },
    {
      name: 'Raw Txn accepted: 1',
      data: resultToUint8Array({
        signTxn: {
          rawTxn: {
            chunkAck: {
              chunkIndex: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Raw Txn accepted: 2',
      data: resultToUint8Array({
        signTxn: {
          rawTxn: {
            chunkAck: {
              chunkIndex: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Raw Txn accepted: 3',
      data: resultToUint8Array({
        signTxn: {
          rawTxn: {
            chunkAck: {
              chunkIndex: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Raw Txn accepted: 4',
      data: resultToUint8Array({
        signTxn: {
          rawTxn: {
            chunkAck: {
              chunkIndex: 0,
            },
          },
        },
      }),
    },
    {
      name: 'Output request: 1',
      data: resultToUint8Array({
        signTxn: {
          outputAccepted: {},
        },
      }),
    },
    {
      name: 'Output request: 2',
      data: resultToUint8Array({
        signTxn: {
          outputAccepted: {},
        },
      }),
    },
    {
      name: 'Output request: 3',
      data: resultToUint8Array({
        signTxn: {
          outputAccepted: {},
        },
      }),
    },
    {
      name: 'Signature: 1',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            unlockingScript: hexToUint8Array(
              '483045022100f996642ea15385598ee56a7102420375e62c49cf5cd2563a3515b21b754058f202203765ff46ea650de668530a924d718e783ea049fc84415dba11565d354ded98ce01210252684be970b3d03c54bb36cc988083a41f70ead329723ffcda17a1703709ee71',
            ),
          },
        },
      }),
    },
    {
      name: 'Signature: 2',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            unlockingScript: hexToUint8Array(
              '47304402207d8829fd1d1990dea9493fb39a3533f2215191f38fc5aa9a2f264aadc76f9a900220692810c4258796927ea8903ca81f2e2f4a9376be6b3106c2dace2b1aa25983650121026f7e8100ad035b1ae1306bedebec21adc2a2ba5a9a432a15dcd314eb03a7a314',
            ),
          },
        },
      }),
    },
    {
      name: 'Signature: 3',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            unlockingScript: hexToUint8Array(
              '47304402205b75335312e81f9716124d8f9ff4fa760b258430b4a2f0aa36794c635bd39fb602207b14f16ae6f336a7c43fc929f7cdf9fa06f9ce0e8d493be2e74dde75d73ddfd9012103838a7502737c06c8dafa084739f753dbdda85fc3407bd6c0d899cc91132df684',
            ),
          },
        },
      }),
    },
    {
      name: 'Signature: 4',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            unlockingScript: hexToUint8Array(
              '483045022100c7dd017936fabf4fb60d15ee99f4ea65efe3063960deebcc3286ec0068cff4a302202a39122e1ff0e6db3a69a9e9a4c69b85700f5fbf6032defdbadd27f9656671990121032794704c9cf7c5c4ccfd2e42451e6c4a94902362c41c88ff7852e10a37548819',
            ),
          },
        },
      }),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4], [5]] },
  output: {
    signatures: [
      '483045022100f996642ea15385598ee56a7102420375e62c49cf5cd2563a3515b21b754058f202203765ff46ea650de668530a924d718e783ea049fc84415dba11565d354ded98ce01210252684be970b3d03c54bb36cc988083a41f70ead329723ffcda17a1703709ee71',
      '47304402207d8829fd1d1990dea9493fb39a3533f2215191f38fc5aa9a2f264aadc76f9a900220692810c4258796927ea8903ca81f2e2f4a9376be6b3106c2dace2b1aa25983650121026f7e8100ad035b1ae1306bedebec21adc2a2ba5a9a432a15dcd314eb03a7a314',
      '47304402205b75335312e81f9716124d8f9ff4fa760b258430b4a2f0aa36794c635bd39fb602207b14f16ae6f336a7c43fc929f7cdf9fa06f9ce0e8d493be2e74dde75d73ddfd9012103838a7502737c06c8dafa084739f753dbdda85fc3407bd6c0d899cc91132df684',
      '483045022100c7dd017936fabf4fb60d15ee99f4ea65efe3063960deebcc3286ec0068cff4a302202a39122e1ff0e6db3a69a9e9a4c69b85700f5fbf6032defdbadd27f9656671990121032794704c9cf7c5c4ccfd2e42451e6c4a94902362c41c88ff7852e10a37548819',
    ],
  },
};

const valid: ISignTxnTestCase[] = [withOneInput, withMultipleInputs];

export default valid;
