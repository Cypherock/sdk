import { ISignTxnTestCase } from './types';
import { Query } from '../../../src/proto/generated/btc/core';

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

          chainIndex: 0,
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
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            signTxn: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
              },
            },
          }),
        ).finish(),
      ),
    },
    {
      name: 'Send meta',
      data: new Uint8Array([26, 10, 18, 8, 8, 2, 16, 1, 24, 1, 40, 1]),
    },
    {
      name: 'Input 1',
      data: new Uint8Array([
        26, 199, 3, 26, 196, 3, 10, 245, 2, 2, 0, 0, 0, 0, 1, 2, 17, 248, 82,
        189, 131, 165, 186, 97, 135, 112, 38, 171, 218, 148, 75, 65, 157, 5,
        196, 118, 141, 247, 0, 90, 139, 143, 108, 174, 20, 228, 165, 127, 38, 0,
        0, 0, 0, 255, 255, 255, 255, 241, 186, 108, 118, 192, 227, 30, 240, 179,
        203, 246, 5, 216, 155, 82, 60, 91, 239, 22, 165, 142, 196, 207, 178, 85,
        15, 73, 164, 16, 138, 255, 79, 1, 0, 0, 0, 0, 255, 255, 255, 255, 2,
        205, 164, 19, 0, 0, 0, 0, 0, 22, 0, 20, 130, 105, 121, 5, 132, 41, 100,
        158, 49, 96, 120, 63, 140, 3, 196, 128, 249, 131, 41, 187, 139, 130, 54,
        0, 0, 0, 0, 0, 23, 169, 20, 50, 145, 82, 47, 28, 214, 105, 158, 138, 7,
        106, 118, 24, 218, 143, 160, 214, 140, 64, 233, 135, 2, 72, 48, 69, 2,
        33, 0, 242, 95, 83, 153, 101, 161, 3, 18, 221, 102, 87, 210, 28, 67,
        135, 38, 24, 251, 171, 58, 43, 198, 166, 101, 25, 39, 53, 229, 225, 155,
        8, 12, 2, 32, 56, 168, 225, 134, 98, 26, 188, 1, 169, 14, 115, 93, 80,
        233, 103, 225, 72, 95, 18, 121, 58, 140, 16, 232, 234, 74, 86, 220, 93,
        202, 97, 155, 1, 33, 3, 78, 230, 63, 188, 29, 215, 44, 49, 113, 121,
        174, 118, 89, 123, 210, 142, 139, 63, 202, 28, 98, 56, 118, 15, 143,
        201, 188, 193, 166, 176, 99, 8, 2, 72, 48, 69, 2, 33, 0, 165, 9, 68,
        152, 161, 153, 19, 187, 241, 187, 156, 161, 41, 215, 0, 183, 113, 214,
        55, 241, 207, 212, 111, 244, 25, 172, 1, 136, 173, 99, 118, 197, 2, 32,
        52, 111, 35, 242, 129, 153, 15, 26, 175, 131, 60, 64, 111, 35, 248, 67,
        159, 86, 26, 17, 101, 115, 16, 169, 122, 55, 30, 230, 25, 28, 2, 4, 1,
        33, 2, 53, 236, 121, 252, 8, 207, 67, 246, 228, 112, 232, 82, 107, 167,
        12, 14, 146, 235, 101, 217, 23, 242, 102, 33, 14, 181, 162, 180, 233,
        235, 148, 36, 0, 0, 0, 0, 18, 32, 169, 145, 85, 223, 114, 234, 134, 202,
        107, 225, 201, 208, 57, 173, 231, 158, 111, 235, 124, 79, 89, 4, 241,
        43, 75, 22, 139, 116, 22, 162, 47, 217, 24, 1, 32, 139, 133, 218, 1, 42,
        25, 118, 169, 20, 23, 75, 194, 235, 125, 247, 0, 48, 86, 35, 128, 180,
        57, 228, 146, 66, 19, 239, 153, 42, 136, 172, 48, 255, 255, 255, 255,
        15, 64, 10,
      ]),
    },
    {
      name: 'Output 1',
      data: new Uint8Array([
        26, 34, 34, 32, 8, 135, 193, 216, 1, 18, 25, 118, 169, 20, 54, 253, 71,
        57, 112, 243, 181, 89, 221, 47, 155, 103, 12, 202, 232, 146, 230, 87,
        17, 29, 136, 172,
      ]),
    },
    {
      name: 'Signature request 1',
      data: new Uint8Array([26, 2, 42, 0]),
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
      name: 'Input request: 1',
      data: new Uint8Array([26, 2, 18, 0]),
    },
    {
      name: 'Output request: 1',
      data: new Uint8Array([26, 2, 26, 0]),
    },
    {
      name: 'Verify',
      data: new Uint8Array([26, 2, 34, 0]),
    },
    {
      name: 'Signature: 1',
      data: new Uint8Array([
        26, 76, 42, 74, 10, 72, 48, 69, 2, 33, 0, 159, 145, 126, 199, 137, 200,
        164, 29, 186, 220, 223, 105, 74, 131, 25, 99, 96, 118, 133, 243, 150,
        144, 144, 130, 41, 58, 26, 218, 70, 13, 67, 79, 2, 32, 38, 90, 145, 175,
        77, 46, 1, 203, 103, 13, 34, 116, 155, 48, 15, 199, 238, 15, 171, 18,
        78, 91, 201, 236, 159, 119, 15, 252, 32, 50, 24, 25, 1,
      ]),
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
          prevTxn:
            '02000000000101d1fdfbab759804e210bf2f87d38f161383a9d6747bab7aabf576dc2ca2338fa32a00000000ffffffff0280841e0000000000160014c140259b3f2b5ebe911ca799f7ab9b4b1065d8fc884d0100000000001600142eb5cdaecb0eb8748f33b159c41808226316a5c302483045022100aa45df282372bf3483ced44c2c69c20a956e1afbca62cc8994f0b815330a466302207d3364516cc4af1acca752c942de4ae87bd88851c8fbb1ee010f5250bd406c69012102adddb9a9dc988284134809c08a45291eb8f99b8486324b8069a763fad46b6bb300000000',

          value: '2000000',
          address: '3F1k49NgiVUQ2rhDAovhk2aw2GmEzXYGC8',

          chainIndex: 0,
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

          chainIndex: 0,
          addressIndex: 54,
        },
        {
          prevIndex: 1,
          prevTxnHash:
            '7774e05cd70c4c64abe48796295a143400c09f430645417937a9649f5329e531',
          prevTxn:
            '020000000001011fdeeaccbf3a30cd6658b6cdf42aafe9f1dba5840f550d38a5b2d2c2205f94c60000000000ffffffff0296c6950d00000000160014e494512f5c3dabec37c7fb02409482940d8ef80ab0ea1d0000000000160014eefc04e0e863a72b90605e52bf8d39e221924c690247304402202890a4c849a922b21f71ecb474f4c0732204db50fcac18c675ccdbb90c34c1d102200a0d81e2304d58b2231546e2cfe70bbbe039c00e9b134d1ae3ad69990bc6e5dd012102edd32b4cb44e9e821ea835b77ae1f73dc30b6ad7ee1b28385117a5ffa89810a300000000',

          value: '1960624',
          address: '3MboCrh8Rnn5HUphnz1kikEkRG5mZdWGgq',

          chainIndex: 1,
          addressIndex: 21,
        },
        {
          prevIndex: 3,
          prevTxnHash:
            '16447d5c065942eb1f6d2bb92c9c9411e2bcbeac3ca2c57bb26dab523af59297',
          prevTxn:
            '02000000000101929833853b3e67c20475a47ed055000df3571934603927fb7f78c0bbb50c789d0000000000ffffffff04c9856e0000000000160014b211d81734360266bb678607e4c92fc7496da7aa4a850a0000000000160014a93163b3247860b7a1544aa5aeb5c6d4c66bcb71f0642b0000000000160014752939efacf0fba63223d3000d1079fc5fbaf52a7ce91c000000000016001478f6c64f867e053ab52830722280772f8e4d878d02483045022100cc1aa3166ea569dd1386d5f97f2f940c88a1dbefe1d8c6982b8960e0f76368cc0220490a751343a2560db60f70dff4417603beb692c7493b209bdd04adbb058fff5a012103838a7502737c06c8dafa084739f753dbdda85fc3407bd6c0d899cc91132df68400000000',

          value: '1894780',
          address: '3BtejuNNGJp7Pa2HwoG92TpKyq15PjfxR4',

          chainIndex: 1,
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
          chainIndex: 1,
          addressIndex: 32,
        },
      ],
    },
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            signTxn: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000],
              },
            },
          }),
        ).finish(),
      ),
    },
    {
      name: 'Send meta',
      data: new Uint8Array([26, 12, 18, 10, 8, 2, 16, 4, 24, 4, 32, 12, 40, 2]),
    },
    {
      name: 'Input 1',
      data: new Uint8Array([
        26, 172, 2, 26, 169, 2, 10, 223, 1, 2, 0, 0, 0, 0, 1, 1, 209, 253, 251,
        171, 117, 152, 4, 226, 16, 191, 47, 135, 211, 143, 22, 19, 131, 169,
        214, 116, 123, 171, 122, 171, 245, 118, 220, 44, 162, 51, 143, 163, 42,
        0, 0, 0, 0, 255, 255, 255, 255, 2, 128, 132, 30, 0, 0, 0, 0, 0, 22, 0,
        20, 193, 64, 37, 155, 63, 43, 94, 190, 145, 28, 167, 153, 247, 171, 155,
        75, 16, 101, 216, 252, 136, 77, 1, 0, 0, 0, 0, 0, 22, 0, 20, 46, 181,
        205, 174, 203, 14, 184, 116, 143, 51, 177, 89, 196, 24, 8, 34, 99, 22,
        165, 195, 2, 72, 48, 69, 2, 33, 0, 170, 69, 223, 40, 35, 114, 191, 52,
        131, 206, 212, 76, 44, 105, 194, 10, 149, 110, 26, 251, 202, 98, 204,
        137, 148, 240, 184, 21, 51, 10, 70, 99, 2, 32, 125, 51, 100, 81, 108,
        196, 175, 26, 204, 167, 82, 201, 66, 222, 74, 232, 123, 216, 136, 81,
        200, 251, 177, 238, 1, 15, 82, 80, 189, 64, 108, 105, 1, 33, 2, 173,
        221, 185, 169, 220, 152, 130, 132, 19, 72, 9, 192, 138, 69, 41, 30, 184,
        249, 155, 132, 134, 50, 75, 128, 105, 167, 99, 250, 212, 107, 107, 179,
        0, 0, 0, 0, 18, 32, 26, 199, 52, 107, 18, 86, 174, 146, 230, 25, 20, 14,
        46, 39, 205, 76, 230, 229, 230, 106, 137, 72, 129, 157, 77, 17, 160,
        200, 165, 194, 226, 67, 32, 128, 137, 122, 42, 23, 169, 20, 146, 36, 74,
        175, 96, 34, 65, 24, 153, 93, 92, 166, 5, 253, 223, 16, 72, 96, 137, 35,
        135, 48, 255, 255, 255, 255, 15, 64, 15,
      ]),
    },
    {
      name: 'Input 2',
      data: new Uint8Array([
        26, 140, 2, 26, 137, 2, 10, 191, 1, 2, 0, 0, 0, 0, 1, 1, 223, 203, 179,
        96, 215, 55, 231, 168, 47, 130, 10, 29, 121, 213, 230, 208, 191, 239,
        139, 13, 248, 38, 33, 214, 35, 41, 249, 71, 220, 244, 3, 215, 0, 0, 0,
        0, 0, 255, 255, 255, 255, 1, 251, 109, 30, 0, 0, 0, 0, 0, 22, 0, 20,
        216, 120, 147, 76, 226, 223, 19, 95, 17, 176, 76, 73, 44, 55, 47, 1,
        219, 201, 67, 85, 2, 71, 48, 68, 2, 32, 108, 158, 50, 209, 109, 27, 216,
        139, 68, 96, 199, 121, 219, 2, 209, 185, 4, 103, 196, 243, 130, 84, 219,
        235, 64, 9, 3, 80, 104, 246, 221, 221, 2, 32, 121, 46, 34, 136, 246,
        224, 94, 17, 250, 127, 49, 43, 148, 226, 96, 44, 242, 114, 52, 78, 202,
        232, 167, 237, 60, 215, 247, 23, 155, 89, 55, 43, 1, 33, 3, 90, 245, 66,
        134, 61, 146, 82, 138, 48, 194, 10, 153, 37, 146, 17, 137, 39, 44, 238,
        170, 43, 98, 207, 110, 36, 192, 202, 0, 173, 137, 30, 184, 0, 0, 0, 0,
        18, 32, 224, 190, 218, 108, 27, 62, 226, 14, 141, 55, 206, 242, 80, 53,
        186, 247, 206, 185, 83, 89, 176, 145, 80, 136, 220, 60, 142, 64, 11, 98,
        164, 233, 32, 251, 219, 121, 42, 23, 169, 20, 157, 76, 35, 193, 46, 79,
        51, 134, 115, 52, 45, 57, 135, 12, 209, 33, 167, 26, 8, 138, 135, 48,
        255, 255, 255, 255, 15, 64, 54,
      ]),
    },
    {
      name: 'Input 3',
      data: new Uint8Array([
        26, 175, 2, 26, 172, 2, 10, 222, 1, 2, 0, 0, 0, 0, 1, 1, 31, 222, 234,
        204, 191, 58, 48, 205, 102, 88, 182, 205, 244, 42, 175, 233, 241, 219,
        165, 132, 15, 85, 13, 56, 165, 178, 210, 194, 32, 95, 148, 198, 0, 0, 0,
        0, 0, 255, 255, 255, 255, 2, 150, 198, 149, 13, 0, 0, 0, 0, 22, 0, 20,
        228, 148, 81, 47, 92, 61, 171, 236, 55, 199, 251, 2, 64, 148, 130, 148,
        13, 142, 248, 10, 176, 234, 29, 0, 0, 0, 0, 0, 22, 0, 20, 238, 252, 4,
        224, 232, 99, 167, 43, 144, 96, 94, 82, 191, 141, 57, 226, 33, 146, 76,
        105, 2, 71, 48, 68, 2, 32, 40, 144, 164, 200, 73, 169, 34, 178, 31, 113,
        236, 180, 116, 244, 192, 115, 34, 4, 219, 80, 252, 172, 24, 198, 117,
        204, 219, 185, 12, 52, 193, 209, 2, 32, 10, 13, 129, 226, 48, 77, 88,
        178, 35, 21, 70, 226, 207, 231, 11, 187, 224, 57, 192, 14, 155, 19, 77,
        26, 227, 173, 105, 153, 11, 198, 229, 221, 1, 33, 2, 237, 211, 43, 76,
        180, 78, 158, 130, 30, 168, 53, 183, 122, 225, 247, 61, 195, 11, 106,
        215, 238, 27, 40, 56, 81, 23, 165, 255, 168, 152, 16, 163, 0, 0, 0, 0,
        18, 32, 119, 116, 224, 92, 215, 12, 76, 100, 171, 228, 135, 150, 41, 90,
        20, 52, 0, 192, 159, 67, 6, 69, 65, 121, 55, 169, 100, 159, 83, 41, 229,
        49, 24, 1, 32, 176, 213, 119, 42, 23, 169, 20, 218, 101, 209, 157, 98,
        182, 189, 163, 96, 58, 238, 95, 71, 204, 103, 47, 244, 179, 244, 76,
        135, 48, 255, 255, 255, 255, 15, 56, 1, 64, 21,
      ]),
    },
    {
      name: 'Input 4',
      data: new Uint8Array([
        26, 238, 2, 26, 235, 2, 10, 157, 2, 2, 0, 0, 0, 0, 1, 1, 146, 152, 51,
        133, 59, 62, 103, 194, 4, 117, 164, 126, 208, 85, 0, 13, 243, 87, 25,
        52, 96, 57, 39, 251, 127, 120, 192, 187, 181, 12, 120, 157, 0, 0, 0, 0,
        0, 255, 255, 255, 255, 4, 201, 133, 110, 0, 0, 0, 0, 0, 22, 0, 20, 178,
        17, 216, 23, 52, 54, 2, 102, 187, 103, 134, 7, 228, 201, 47, 199, 73,
        109, 167, 170, 74, 133, 10, 0, 0, 0, 0, 0, 22, 0, 20, 169, 49, 99, 179,
        36, 120, 96, 183, 161, 84, 74, 165, 174, 181, 198, 212, 198, 107, 203,
        113, 240, 100, 43, 0, 0, 0, 0, 0, 22, 0, 20, 117, 41, 57, 239, 172, 240,
        251, 166, 50, 35, 211, 0, 13, 16, 121, 252, 95, 186, 245, 42, 124, 233,
        28, 0, 0, 0, 0, 0, 22, 0, 20, 120, 246, 198, 79, 134, 126, 5, 58, 181,
        40, 48, 114, 34, 128, 119, 47, 142, 77, 135, 141, 2, 72, 48, 69, 2, 33,
        0, 204, 26, 163, 22, 110, 165, 105, 221, 19, 134, 213, 249, 127, 47,
        148, 12, 136, 161, 219, 239, 225, 216, 198, 152, 43, 137, 96, 224, 247,
        99, 104, 204, 2, 32, 73, 10, 117, 19, 67, 162, 86, 13, 182, 15, 112,
        223, 244, 65, 118, 3, 190, 182, 146, 199, 73, 59, 32, 155, 221, 4, 173,
        187, 5, 143, 255, 90, 1, 33, 3, 131, 138, 117, 2, 115, 124, 6, 200, 218,
        250, 8, 71, 57, 247, 83, 219, 221, 168, 95, 195, 64, 123, 214, 192, 216,
        153, 204, 145, 19, 45, 246, 132, 0, 0, 0, 0, 18, 32, 22, 68, 125, 92, 6,
        89, 66, 235, 31, 109, 43, 185, 44, 156, 148, 17, 226, 188, 190, 172, 60,
        162, 197, 123, 178, 109, 171, 82, 58, 245, 146, 151, 24, 3, 32, 252,
        210, 115, 42, 23, 169, 20, 111, 228, 144, 250, 200, 143, 220, 72, 219,
        239, 41, 247, 175, 70, 242, 28, 157, 199, 153, 156, 135, 48, 255, 255,
        255, 255, 15, 56, 1, 64, 21,
      ]),
    },
    {
      name: 'Output 1',
      data: new Uint8Array([
        26, 32, 34, 30, 8, 148, 203, 232, 1, 18, 23, 169, 20, 227, 78, 154, 53,
        60, 255, 242, 35, 245, 60, 25, 22, 3, 94, 32, 253, 122, 198, 207, 4,
        135,
      ]),
    },
    {
      name: 'Output 2',
      data: new Uint8Array([
        26, 32, 34, 30, 8, 243, 128, 222, 1, 18, 23, 169, 20, 114, 79, 205, 94,
        254, 165, 48, 80, 3, 163, 84, 46, 30, 177, 51, 69, 211, 240, 181, 5,
        135,
      ]),
    },
    {
      name: 'Output 3',
      data: new Uint8Array([
        26, 37, 34, 35, 8, 224, 172, 23, 18, 23, 169, 20, 54, 121, 87, 95, 237,
        170, 99, 232, 147, 233, 127, 6, 105, 131, 10, 194, 138, 83, 218, 11,
        135, 24, 1, 32, 1, 40, 32,
      ]),
    },
    {
      name: 'Signature request 1',
      data: new Uint8Array([26, 2, 42, 0]),
    },
    {
      name: 'Signature request 2',
      data: new Uint8Array([26, 4, 42, 2, 8, 1]),
    },
    {
      name: 'Signature request 3',
      data: new Uint8Array([26, 4, 42, 2, 8, 2]),
    },
    {
      name: 'Signature request 4',
      data: new Uint8Array([26, 4, 42, 2, 8, 3]),
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
      name: 'Input request: 1',
      data: new Uint8Array([26, 2, 18, 0]),
    },
    {
      name: 'Input request: 2',
      data: new Uint8Array([26, 4, 18, 2, 8, 1]),
    },
    {
      name: 'Input request: 3',
      data: new Uint8Array([26, 4, 18, 2, 8, 2]),
    },
    {
      name: 'Input request: 4',
      data: new Uint8Array([26, 4, 18, 2, 8, 3]),
    },
    {
      name: 'Output request: 1',
      data: new Uint8Array([26, 2, 26, 0]),
    },
    {
      name: 'Output request: 2',
      data: new Uint8Array([26, 4, 26, 2, 8, 1]),
    },
    {
      name: 'Output request: 3',
      data: new Uint8Array([26, 4, 26, 2, 8, 2]),
    },
    {
      name: 'Verify',
      data: new Uint8Array([26, 2, 34, 0]),
    },
    {
      name: 'Signature: 1',
      data: new Uint8Array([
        26, 111, 42, 109, 10, 107, 72, 48, 69, 2, 33, 0, 249, 150, 100, 46, 161,
        83, 133, 89, 142, 229, 106, 113, 2, 66, 3, 117, 230, 44, 73, 207, 92,
        210, 86, 58, 53, 21, 178, 27, 117, 64, 88, 242, 2, 32, 55, 101, 255, 70,
        234, 101, 13, 230, 104, 83, 10, 146, 77, 113, 142, 120, 62, 160, 73,
        252, 132, 65, 93, 186, 17, 86, 93, 53, 77, 237, 152, 206, 1, 33, 2, 82,
        104, 75, 233, 112, 179, 208, 60, 84, 187, 54, 204, 152, 128, 131, 164,
        31, 112, 234, 211, 41, 114, 63, 252, 218, 23, 161, 112, 55, 9, 238, 113,
      ]),
    },
    {
      name: 'Signature: 2',
      data: new Uint8Array([
        26, 110, 42, 108, 10, 106, 71, 48, 68, 2, 32, 125, 136, 41, 253, 29, 25,
        144, 222, 169, 73, 63, 179, 154, 53, 51, 242, 33, 81, 145, 243, 143,
        197, 170, 154, 47, 38, 74, 173, 199, 111, 154, 144, 2, 32, 105, 40, 16,
        196, 37, 135, 150, 146, 126, 168, 144, 60, 168, 31, 46, 47, 74, 147,
        118, 190, 107, 49, 6, 194, 218, 206, 43, 26, 162, 89, 131, 101, 1, 33,
        2, 111, 126, 129, 0, 173, 3, 91, 26, 225, 48, 107, 237, 235, 236, 33,
        173, 194, 162, 186, 90, 154, 67, 42, 21, 220, 211, 20, 235, 3, 167, 163,
        20,
      ]),
    },
    {
      name: 'Signature: 3',
      data: new Uint8Array([
        26, 110, 42, 108, 10, 106, 71, 48, 68, 2, 32, 91, 117, 51, 83, 18, 232,
        31, 151, 22, 18, 77, 143, 159, 244, 250, 118, 11, 37, 132, 48, 180, 162,
        240, 170, 54, 121, 76, 99, 91, 211, 159, 182, 2, 32, 123, 20, 241, 106,
        230, 243, 54, 167, 196, 63, 201, 41, 247, 205, 249, 250, 6, 249, 206,
        14, 141, 73, 59, 226, 231, 77, 222, 117, 215, 61, 223, 217, 1, 33, 3,
        131, 138, 117, 2, 115, 124, 6, 200, 218, 250, 8, 71, 57, 247, 83, 219,
        221, 168, 95, 195, 64, 123, 214, 192, 216, 153, 204, 145, 19, 45, 246,
        132,
      ]),
    },
    {
      name: 'Signature: 4',
      data: new Uint8Array([
        26, 111, 42, 109, 10, 107, 72, 48, 69, 2, 33, 0, 199, 221, 1, 121, 54,
        250, 191, 79, 182, 13, 21, 238, 153, 244, 234, 101, 239, 227, 6, 57, 96,
        222, 235, 204, 50, 134, 236, 0, 104, 207, 244, 163, 2, 32, 42, 57, 18,
        46, 31, 240, 230, 219, 58, 105, 169, 233, 164, 198, 155, 133, 112, 15,
        95, 191, 96, 50, 222, 253, 186, 221, 39, 249, 101, 102, 113, 153, 1, 33,
        3, 39, 148, 112, 76, 156, 247, 197, 196, 204, 253, 46, 66, 69, 30, 108,
        74, 148, 144, 35, 98, 196, 28, 136, 255, 120, 82, 225, 10, 55, 84, 136,
        25,
      ]),
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
