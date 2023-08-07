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
          prevTxn:
            '0200000000010211f852bd83a5ba61877026abda944b419d05c4768df7005a8b8f6cae14e4a57f2600000000fffffffff1ba6c76c0e31ef0b3cbf605d89b523c5bef16a58ec4cfb2550f49a4108aff4f0100000000ffffffff02cda4130000000000160014826979058429649e3160783f8c03c480f98329bb8b8236000000000017a9143291522f1cd6699e8a076a7618da8fa0d68c40e98702483045022100f25f539965a10312dd6657d21c43872618fbab3a2bc6a665192735e5e19b080c022038a8e186621abc01a90e735d50e967e1485f12793a8c10e8ea4a56dc5dca619b0121034ee63fbc1dd72c317179ae76597bd28e8b3fca1c6238760f8fc9bcc1a6b0630802483045022100a5094498a19913bbf1bb9ca129d700b771d637f1cfd46ff419ac0188ad6376c50220346f23f281990f1aaf833c406f23f8439f561a11657310a97a371ee6191c020401210235ec79fc08cf43f6e470e8526ba70c0e92eb65d917f266210eb5a2b4e9eb942400000000',
          value: '3572363',
          address: '138BJQbgKvZZMG6d3k8uGXidBeGgWfeacV',
          changeIndex: 0,
          addressIndex: 10,
          sequence: 0xffffffff,
        },
      ],
      outputs: [
        {
          value: '3547271',
          address: '161kuSQmUch28WMndPEaw4uZUiyGye6UxF',
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
            prevTxn: hexToUint8Array(''),
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
          signature: { index: 0 },
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
            signature: hexToUint8Array(
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
          address: '3F1k49NgiVUQ2rhDAovhk2aw2GmEzXYGC8',

          changeIndex: 0,
          addressIndex: 15,
        },
        {
          prevIndex: 0,
          prevTxnHash:
            'e0beda6c1b3ee20e8d37cef25035baf7ceb95359b0915088dc3c8e400b62a4e9',
          prevTxn:
            '02000000000101dfcbb360d737e7a82f820a1d79d5e6d0bfef8b0df82621d62329f947dcf403d70000000000ffffffff01fb6d1e0000000000160014d878934ce2df135f11b04c492c372f01dbc943550247304402206c9e32d16d1bd88b4460c779db02d1b90467c4f38254dbeb4009035068f6dddd0220792e2288f6e05e11fa7f312b94e2602cf272344ecae8a7ed3cd7f7179b59372b0121035af542863d92528a30c20a9925921189272ceeaa2b62cf6e24c0ca00ad891eb800000000',
          value: '1994235',
          address: '3G2jDwMMBGpEgrK6RfGYob8e7UL9vtowyk',

          changeIndex: 0,
          addressIndex: 54,
        },
        {
          prevIndex: 1,
          prevTxnHash:
            '7774e05cd70c4c64abe48796295a143400c09f430645417937a9649f5329e531',
          value: '1960624',
          address: '3MboCrh8Rnn5HUphnz1kikEkRG5mZdWGgq',

          changeIndex: 1,
          addressIndex: 21,
        },
        {
          prevIndex: 3,
          prevTxnHash:
            '16447d5c065942eb1f6d2bb92c9c9411e2bcbeac3ca2c57bb26dab523af59297',
          value: '1894780',
          address: '3BtejuNNGJp7Pa2HwoG92TpKyq15PjfxR4',

          changeIndex: 1,
          addressIndex: 21,
        },
      ],
      outputs: [
        {
          value: '3810708',
          address: '3NQuUUgGpYXqGQN9N2E7jVrFevwbPuTdLw',
          isChange: false,
        },
        {
          value: '3637363',
          address: '3C7SZAjVYwqUK7o6WcbQ7HkuRwsUD9RGDv',
          isChange: false,
        },
        {
          value: '382560',
          address: '36f3mqvyCaX2ZoF2rXHcmSd9v2ph1RBBCo',
          isChange: true,
          addressIndex: 1,
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
            prevTxn: hexToUint8Array(''),
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
            prevTxn: hexToUint8Array(''),
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
            prevTxn: hexToUint8Array(
              '020000000001011fdeeaccbf3a30cd6658b6cdf42aafe9f1dba5840f550d38a5b2d2c2205f94c60000000000ffffffff0296c6950d00000000160014e494512f5c3dabec37c7fb02409482940d8ef80ab0ea1d0000000000160014eefc04e0e863a72b90605e52bf8d39e221924c690247304402202890a4c849a922b21f71ecb474f4c0732204db50fcac18c675ccdbb90c34c1d102200a0d81e2304d58b2231546e2cfe70bbbe039c00e9b134d1ae3ad69990bc6e5dd012102edd32b4cb44e9e821ea835b77ae1f73dc30b6ad7ee1b28385117a5ffa89810a300000000',
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
            prevTxn: hexToUint8Array(
              '02000000000101929833853b3e67c20475a47ed055000df3571934603927fb7f78c0bbb50c789d0000000000ffffffff04c9856e0000000000160014b211d81734360266bb678607e4c92fc7496da7aa4a850a0000000000160014a93163b3247860b7a1544aa5aeb5c6d4c66bcb71f0642b0000000000160014752939efacf0fba63223d3000d1079fc5fbaf52a7ce91c000000000016001478f6c64f867e053ab52830722280772f8e4d878d02483045022100cc1aa3166ea569dd1386d5f97f2f940c88a1dbefe1d8c6982b8960e0f76368cc0220490a751343a2560db60f70dff4417603beb692c7493b209bdd04adbb058fff5a012103838a7502737c06c8dafa084739f753dbdda85fc3407bd6c0d899cc91132df68400000000',
            ),
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
          signature: { index: 0 },
        },
      }),
    },
    {
      name: 'Signature request 2',
      data: queryToUint8Array({
        signTxn: {
          signature: { index: 1 },
        },
      }),
    },
    {
      name: 'Signature request 3',
      data: queryToUint8Array({
        signTxn: {
          signature: { index: 2 },
        },
      }),
    },
    {
      name: 'Signature request 4',
      data: queryToUint8Array({
        signTxn: {
          signature: { index: 3 },
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
            signature: hexToUint8Array(
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
            signature: hexToUint8Array(
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
            signature: hexToUint8Array(
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
            signature: hexToUint8Array(
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
