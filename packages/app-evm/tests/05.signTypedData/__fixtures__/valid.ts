import BigNumber from 'bignumber.js';
import { ISignTypedDataCase } from './types';

const valid: ISignTypedDataCase[] = [
  {
    data: {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        Person: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'wallet',
            type: 'address',
          },
        ],
        Mail: [
          {
            name: 'from',
            type: 'Person',
          },
          {
            name: 'to',
            type: 'Person',
          },
          {
            name: 'contents',
            type: 'string',
          },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0x1e0Ae8205e9726E6F296ab8869160A6423E2337E',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xc0004B62C5A39a728e4Af5bee0c6B4a4E54b15ad',
        },
        to: {
          name: 'Bob',
          wallet: '0x54B0Fa66A065748C40dCA2C7Fe125A2028CF9982',
        },
        contents: 'Hello, Bob!',
      },
    },
    results: {
      domain: {
        name: 'domain',
        type: 7,
        size: 4,
        structName: 'EIP712Domain',
        children: [
          {
            name: 'name',
            type: 3,
            size: 10,
            structName: 'string',
            children: [],
            data: Buffer.from([69, 116, 104, 101, 114, 32, 77, 97, 105, 108]),
          },
          {
            name: 'version',
            type: 3,
            size: 1,
            structName: 'string',
            children: [],
            data: Buffer.from([49]),
          },
          {
            name: 'chainId',
            type: 0,
            size: 32,
            structName: 'uint256',
            children: [],
            data: Buffer.from([
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            ]),
          },
          {
            name: 'verifyingContract',
            type: 5,
            size: 20,
            structName: 'address',
            children: [],
            data: Buffer.from([
              30, 10, 232, 32, 94, 151, 38, 230, 242, 150, 171, 136, 105, 22,
              10, 100, 35, 226, 51, 126,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          139, 115, 195, 198, 155, 184, 254, 61, 81, 46, 204, 76, 247, 89, 204,
          121, 35, 159, 123, 23, 155, 15, 250, 202, 169, 167, 93, 82, 43, 57,
          64, 15,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 3,
        structName: 'Mail',
        children: [
          {
            name: 'from',
            type: 7,
            size: 2,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([67, 111, 119]),
              },
              {
                name: 'wallet',
                type: 5,
                size: 20,
                structName: 'address',
                children: [],
                data: Buffer.from([
                  192, 0, 75, 98, 197, 163, 154, 114, 142, 74, 245, 190, 224,
                  198, 180, 164, 229, 75, 21, 173,
                ]),
              },
            ],
            typeHash: Uint8Array.from([
              185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
              187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33, 99,
              249, 148, 199, 149, 0,
            ]),
          },
          {
            name: 'to',
            type: 7,
            size: 2,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([66, 111, 98]),
              },
              {
                name: 'wallet',
                type: 5,
                size: 20,
                structName: 'address',
                children: [],
                data: Buffer.from([
                  84, 176, 250, 102, 160, 101, 116, 140, 64, 220, 162, 199, 254,
                  18, 90, 32, 40, 207, 153, 130,
                ]),
              },
            ],
            typeHash: Uint8Array.from([
              185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
              187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33, 99,
              249, 148, 199, 149, 0,
            ]),
          },
          {
            name: 'contents',
            type: 3,
            size: 11,
            structName: 'string',
            children: [],
            data: Buffer.from([
              72, 101, 108, 108, 111, 44, 32, 66, 111, 98, 33,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          160, 206, 222, 178, 220, 40, 11, 163, 155, 133, 117, 70, 215, 79, 85,
          73, 195, 161, 215, 189, 194, 221, 150, 191, 136, 31, 118, 16, 142, 35,
          218, 194,
        ]),
      },
    },
  },
  {
    data: {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
          {
            name: 'salt',
            type: 'bytes32',
          },
        ],
        Person: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'wallet',
            type: 'address',
          },
          {
            name: 'married',
            type: 'bool',
          },
          {
            name: 'kids',
            type: 'uint8',
          },
          {
            name: 'karma',
            type: 'int16',
          },
          {
            name: 'secret',
            type: 'bytes',
          },
          {
            name: 'small_secret',
            type: 'bytes16',
          },
          {
            name: 'pets',
            type: 'string[]',
          },
          {
            name: 'two_best_friends',
            type: 'string[2]',
          },
        ],
        Mail: [
          {
            name: 'from',
            type: 'Person',
          },
          {
            name: 'to',
            type: 'Person',
          },
          {
            name: 'messages',
            type: 'string[]',
          },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0x1e0Ae8205e9726E6F296ab8869160A6423E2337E',
        salt: '0xca92da1a6e91d9358328d2f2155af143a7cb74b81a3a4e3e57e2191823dbb56c',
      },
      message: {
        from: {
          name: 'Amy',
          wallet: '0xc0004B62C5A39a728e4Af5bee0c6B4a4E54b15ad',
          married: true,
          kids: 2,
          karma: 4,
          secret:
            '0x62c5a39a728e4af5bee0c6b462c5a39a728e4af5bee0c6b462c5a39a728e4af5bee0c6b462c5a39a728e4af5bee0c6b4',
          small_secret: '0x5ccf0e54367104795a47bc0481645d9e',
          pets: ['parrot'],
          two_best_friends: ['Carl', 'Denis'],
        },
        to: {
          name: 'Bob',
          wallet: '0x54B0Fa66A065748C40dCA2C7Fe125A2028CF9982',
          married: false,
          kids: 0,
          karma: -4,
          secret:
            '0x7fe125a2028cf97fe125a2028cf97fe125a2028cf97fe125a2028cf97fe125a2028cf97fe125a2028cf97fe125a2028cf9',
          small_secret: '0xa5e5c47b64775abc476d2962403258de',
          pets: ['dog', 'cat'],
          two_best_friends: ['Emil', 'Franz'],
        },
        messages: ['Hello, Bob!', 'How are you?', "Hope you're fine"],
      },
    },
    results: {
      domain: {
        name: 'domain',
        type: 7,
        size: 5,
        structName: 'EIP712Domain',
        children: [
          {
            name: 'name',
            type: 3,
            size: 10,
            structName: 'string',
            children: [],
            data: Buffer.from([69, 116, 104, 101, 114, 32, 77, 97, 105, 108]),
          },
          {
            name: 'version',
            type: 3,
            size: 1,
            structName: 'string',
            children: [],
            data: Buffer.from([49]),
          },
          {
            name: 'chainId',
            type: 0,
            size: 32,
            structName: 'uint256',
            children: [],
            data: Buffer.from([
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            ]),
          },
          {
            name: 'verifyingContract',
            type: 5,
            size: 20,
            structName: 'address',
            children: [],
            data: Buffer.from([
              30, 10, 232, 32, 94, 151, 38, 230, 242, 150, 171, 136, 105, 22,
              10, 100, 35, 226, 51, 126,
            ]),
          },
          {
            name: 'salt',
            type: 2,
            size: 32,
            structName: 'bytes32',
            children: [],
            data: Buffer.from([
              202, 146, 218, 26, 110, 145, 217, 53, 131, 40, 210, 242, 21, 90,
              241, 67, 167, 203, 116, 184, 26, 58, 78, 62, 87, 226, 25, 24, 35,
              219, 181, 108,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          216, 124, 214, 239, 121, 212, 226, 185, 94, 21, 206, 138, 191, 115,
          45, 181, 30, 199, 113, 241, 202, 46, 220, 207, 34, 164, 108, 114, 154,
          197, 100, 114,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 3,
        structName: 'Mail',
        children: [
          {
            name: 'from',
            type: 7,
            size: 9,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([65, 109, 121]),
              },
              {
                name: 'wallet',
                type: 5,
                size: 20,
                structName: 'address',
                children: [],
                data: Buffer.from([
                  192, 0, 75, 98, 197, 163, 154, 114, 142, 74, 245, 190, 224,
                  198, 180, 164, 229, 75, 21, 173,
                ]),
              },
              {
                name: 'married',
                type: 4,
                size: 1,
                structName: 'bool',
                children: [],
                data: new BigNumber(1) as any,
              },
              {
                name: 'kids',
                type: 0,
                size: 1,
                structName: 'uint8',
                children: [],
                data: Buffer.from([2]),
              },
              {
                name: 'karma',
                type: 1,
                size: 2,
                structName: 'int16',
                children: [],
                data: Buffer.from([0, 4]),
              },
              {
                name: 'secret',
                type: 2,
                size: 48,
                structName: 'bytes',
                children: [],
                data: Buffer.from([
                  98, 197, 163, 154, 114, 142, 74, 245, 190, 224, 198, 180, 98,
                  197, 163, 154, 114, 142, 74, 245, 190, 224, 198, 180, 98, 197,
                  163, 154, 114, 142, 74, 245, 190, 224, 198, 180, 98, 197, 163,
                  154, 114, 142, 74, 245, 190, 224, 198, 180,
                ]),
              },
              {
                name: 'small_secret',
                type: 2,
                size: 16,
                structName: 'bytes16',
                children: [],
                data: Buffer.from([
                  92, 207, 14, 84, 54, 113, 4, 121, 90, 71, 188, 4, 129, 100,
                  93, 158,
                ]),
              },
              {
                name: 'pets',
                type: 6,
                size: 1,
                structName: 'string[]',
                children: [],
                data: undefined,
              },
              {
                name: 'two_best_friends',
                type: 6,
                size: 2,
                structName: 'string[2]',
                children: [],
                data: undefined,
              },
            ],
            typeHash: Uint8Array.from([
              224, 209, 48, 64, 99, 143, 154, 50, 164, 74, 90, 11, 131, 232,
              191, 33, 210, 27, 168, 165, 57, 31, 210, 125, 141, 196, 114, 241,
              246, 234, 219, 5,
            ]),
          },
          {
            name: 'to',
            type: 7,
            size: 9,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([66, 111, 98]),
              },
              {
                name: 'wallet',
                type: 5,
                size: 20,
                structName: 'address',
                children: [],
                data: Buffer.from([
                  84, 176, 250, 102, 160, 101, 116, 140, 64, 220, 162, 199, 254,
                  18, 90, 32, 40, 207, 153, 130,
                ]),
              },
              {
                name: 'married',
                type: 4,
                size: 1,
                structName: 'bool',
                children: [],
                data: new BigNumber(0) as any,
              },
              {
                name: 'kids',
                type: 0,
                size: 1,
                structName: 'uint8',
                children: [],
                data: Buffer.from([0]),
              },
              {
                name: 'karma',
                type: 1,
                size: 2,
                structName: 'int16',
                children: [],
                data: Buffer.from([255, 252]),
              },
              {
                name: 'secret',
                type: 2,
                size: 49,
                structName: 'bytes',
                children: [],
                data: Buffer.from([
                  127, 225, 37, 162, 2, 140, 249, 127, 225, 37, 162, 2, 140,
                  249, 127, 225, 37, 162, 2, 140, 249, 127, 225, 37, 162, 2,
                  140, 249, 127, 225, 37, 162, 2, 140, 249, 127, 225, 37, 162,
                  2, 140, 249, 127, 225, 37, 162, 2, 140, 249,
                ]),
              },
              {
                name: 'small_secret',
                type: 2,
                size: 16,
                structName: 'bytes16',
                children: [],
                data: Buffer.from([
                  165, 229, 196, 123, 100, 119, 90, 188, 71, 109, 41, 98, 64,
                  50, 88, 222,
                ]),
              },
              {
                name: 'pets',
                type: 6,
                size: 2,
                structName: 'string[]',
                children: [],
                data: undefined,
              },
              {
                name: 'two_best_friends',
                type: 6,
                size: 2,
                structName: 'string[2]',
                children: [],
                data: undefined,
              },
            ],
            typeHash: Uint8Array.from([
              224, 209, 48, 64, 99, 143, 154, 50, 164, 74, 90, 11, 131, 232,
              191, 33, 210, 27, 168, 165, 57, 31, 210, 125, 141, 196, 114, 241,
              246, 234, 219, 5,
            ]),
          },
          {
            name: 'messages',
            type: 6,
            size: 3,
            structName: 'string[]',
            children: [],
            data: undefined,
          },
        ],
        typeHash: Uint8Array.from([
          222, 233, 20, 58, 216, 41, 180, 29, 69, 233, 9, 197, 16, 7, 2, 173,
          217, 6, 186, 242, 219, 41, 138, 57, 96, 190, 100, 236, 128, 190, 141,
          144,
        ]),
      },
    },
  },
  {
    data: {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        Person: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'wallet',
            type: 'address',
          },
        ],
        Mail: [
          {
            name: 'from',
            type: 'Person',
          },
          {
            name: 'to',
            type: 'Person[]',
          },
          {
            name: 'contents',
            type: 'string',
          },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0x1e0Ae8205e9726E6F296ab8869160A6423E2337E',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xc0004B62C5A39a728e4Af5bee0c6B4a4E54b15ad',
        },
        to: [
          {
            name: 'Bob',
            wallet: '0x54B0Fa66A065748C40dCA2C7Fe125A2028CF9982',
          },
          {
            name: 'Dave',
            wallet: '0x73d0385F4d8E00C5e6504C6030F47BF6212736A8',
          },
        ],
        contents: 'Hello, guys!',
      },
    },
    results: {
      domain: {
        name: 'domain',
        type: 7,
        size: 4,
        structName: 'EIP712Domain',
        children: [
          {
            name: 'name',
            type: 3,
            size: 10,
            structName: 'string',
            children: [],
            data: Buffer.from([69, 116, 104, 101, 114, 32, 77, 97, 105, 108]),
          },
          {
            name: 'version',
            type: 3,
            size: 1,
            structName: 'string',
            children: [],
            data: Buffer.from([49]),
          },
          {
            name: 'chainId',
            type: 0,
            size: 32,
            structName: 'uint256',
            children: [],
            data: Buffer.from([
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            ]),
          },
          {
            name: 'verifyingContract',
            type: 5,
            size: 20,
            structName: 'address',
            children: [],
            data: Buffer.from([
              30, 10, 232, 32, 94, 151, 38, 230, 242, 150, 171, 136, 105, 22,
              10, 100, 35, 226, 51, 126,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          139, 115, 195, 198, 155, 184, 254, 61, 81, 46, 204, 76, 247, 89, 204,
          121, 35, 159, 123, 23, 155, 15, 250, 202, 169, 167, 93, 82, 43, 57,
          64, 15,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 3,
        structName: 'Mail',
        children: [
          {
            name: 'from',
            type: 7,
            size: 2,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([67, 111, 119]),
              },
              {
                name: 'wallet',
                type: 5,
                size: 20,
                structName: 'address',
                children: [],
                data: Buffer.from([
                  192, 0, 75, 98, 197, 163, 154, 114, 142, 74, 245, 190, 224,
                  198, 180, 164, 229, 75, 21, 173,
                ]),
              },
            ],
            typeHash: Uint8Array.from([
              185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
              187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33, 99,
              249, 148, 199, 149, 0,
            ]),
          },
          {
            name: 'to',
            type: 6,
            size: 2,
            structName: 'Person[]',
            children: [
              {
                name: '0',
                type: 7,
                size: 2,
                structName: 'Person',
                children: [
                  {
                    name: 'name',
                    type: 3,
                    size: 3,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([66, 111, 98]),
                  },
                  {
                    name: 'wallet',
                    type: 5,
                    size: 20,
                    structName: 'address',
                    children: [],
                    data: Buffer.from([
                      84, 176, 250, 102, 160, 101, 116, 140, 64, 220, 162, 199,
                      254, 18, 90, 32, 40, 207, 153, 130,
                    ]),
                  },
                ],
                typeHash: Uint8Array.from([
                  185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
                  187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33,
                  99, 249, 148, 199, 149, 0,
                ]),
              },
              {
                name: '1',
                type: 7,
                size: 2,
                structName: 'Person',
                children: [
                  {
                    name: 'name',
                    type: 3,
                    size: 4,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([68, 97, 118, 101]),
                  },
                  {
                    name: 'wallet',
                    type: 5,
                    size: 20,
                    structName: 'address',
                    children: [],
                    data: Buffer.from([
                      115, 208, 56, 95, 77, 142, 0, 197, 230, 80, 76, 96, 48,
                      244, 123, 246, 33, 39, 54, 168,
                    ]),
                  },
                ],
                typeHash: Uint8Array.from([
                  185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
                  187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33,
                  99, 249, 148, 199, 149, 0,
                ]),
              },
            ],
          },
          {
            name: 'contents',
            type: 3,
            size: 12,
            structName: 'string',
            children: [],
            data: Buffer.from([
              72, 101, 108, 108, 111, 44, 32, 103, 117, 121, 115, 33,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          221, 87, 217, 89, 106, 245, 43, 67, 12, 237, 61, 91, 82, 212, 227,
          213, 220, 207, 223, 62, 5, 114, 219, 29, 207, 82, 107, 170, 211, 17,
          251, 209,
        ]),
      },
    },
  },
  {
    data: {
      domain: {
        chainId: 1,
        name: 'Ether Mail',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        version: '1',
      },
      message: {
        contents: 'Hello, Bob!',
        from: {
          name: 'Cow',
          wallets: [
            '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
            '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
          ],
        },
        to: [
          {
            name: 'Bob',
            wallets: [
              '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
              '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
              '0xB0B0b0b0b0b0B000000000000000000000000000',
            ],
          },
        ],
      },
      primaryType: 'Mail',
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        Group: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'members',
            type: 'Person[]',
          },
        ],
        Mail: [
          {
            name: 'from',
            type: 'Person',
          },
          {
            name: 'to',
            type: 'Person[]',
          },
          {
            name: 'contents',
            type: 'string',
          },
        ],
        Person: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'wallets',
            type: 'address[]',
          },
        ],
      },
    },
    results: {
      domain: {
        name: 'domain',
        type: 7,
        size: 4,
        structName: 'EIP712Domain',
        children: [
          {
            name: 'chainId',
            type: 0,
            size: 32,
            structName: 'uint256',
            children: [],
            data: Buffer.from([
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            ]),
          },
          {
            name: 'name',
            type: 3,
            size: 10,
            structName: 'string',
            children: [],
            data: Buffer.from([69, 116, 104, 101, 114, 32, 77, 97, 105, 108]),
          },
          {
            name: 'verifyingContract',
            type: 5,
            size: 20,
            structName: 'address',
            children: [],
            data: Buffer.from([
              204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204, 204,
              204, 204, 204, 204, 204, 204, 204,
            ]),
          },
          {
            name: 'version',
            type: 3,
            size: 1,
            structName: 'string',
            children: [],
            data: Buffer.from([49]),
          },
        ],
        typeHash: Uint8Array.from([
          139, 115, 195, 198, 155, 184, 254, 61, 81, 46, 204, 76, 247, 89, 204,
          121, 35, 159, 123, 23, 155, 15, 250, 202, 169, 167, 93, 82, 43, 57,
          64, 15,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 3,
        structName: 'Mail',
        children: [
          {
            name: 'contents',
            type: 3,
            size: 11,
            structName: 'string',
            children: [],
            data: Buffer.from([
              72, 101, 108, 108, 111, 44, 32, 66, 111, 98, 33,
            ]),
          },
          {
            name: 'from',
            type: 7,
            size: 2,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([67, 111, 119]),
              },
              {
                name: 'wallets',
                type: 6,
                size: 2,
                structName: 'address[]',
                children: [],
              },
            ],
            typeHash: Uint8Array.from([
              250, 191, 225, 237, 153, 99, 73, 252, 96, 39, 112, 152, 2, 190,
              25, 208, 71, 218, 26, 165, 214, 137, 79, 245, 246, 72, 109, 146,
              219, 46, 104, 96,
            ]),
          },
          {
            name: 'to',
            type: 6,
            size: 1,
            structName: 'Person[]',
            children: [
              {
                name: '0',
                type: 7,
                size: 2,
                structName: 'Person',
                children: [
                  {
                    name: 'name',
                    type: 3,
                    size: 3,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([66, 111, 98]),
                  },
                  {
                    name: 'wallets',
                    type: 6,
                    size: 3,
                    structName: 'address[]',
                    children: [],
                  },
                ],
                typeHash: Uint8Array.from([
                  250, 191, 225, 237, 153, 99, 73, 252, 96, 39, 112, 152, 2,
                  190, 25, 208, 71, 218, 26, 165, 214, 137, 79, 245, 246, 72,
                  109, 146, 219, 46, 104, 96,
                ]),
              },
            ],
          },
        ],
        typeHash: Uint8Array.from([
          75, 216, 169, 162, 185, 52, 39, 187, 24, 74, 202, 129, 226, 75, 235,
          48, 255, 163, 199, 71, 226, 163, 61, 66, 37, 236, 8, 191, 18, 226,
          231, 83,
        ]),
      },
    },
  },
  {
    data: {
      types: {
        EIP712Domain: [],
        Message: [
          {
            name: 'element',
            type: 'Element[]',
          },
        ],
        Element: [
          {
            name: 'foo',
            type: 'int8',
          },
        ],
      },
      primaryType: 'Message',
      message: {
        element: [
          {
            foo: 1,
          },
          {
            foo: 2,
          },
        ],
      },
      domain: {},
    },
    results: {
      domain: {
        name: 'domain',
        type: 7,
        size: 0,
        structName: 'EIP712Domain',
        children: [],
        typeHash: Uint8Array.from([
          32, 188, 195, 248, 16, 94, 234, 71, 208, 103, 56, 110, 66, 230, 2, 70,
          232, 147, 147, 205, 97, 197, 18, 237, 209, 232, 118, 136, 137, 15,
          185, 20,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 1,
        structName: 'Message',
        children: [
          {
            name: 'element',
            type: 6,
            size: 2,
            structName: 'Element[]',
            children: [
              {
                name: '0',
                type: 7,
                size: 1,
                structName: 'Element',
                children: [
                  {
                    name: 'foo',
                    type: 1,
                    size: 1,
                    structName: 'int8',
                    children: [],
                    data: Buffer.from([1]),
                  },
                ],
                typeHash: Uint8Array.from([
                  103, 190, 128, 30, 223, 130, 73, 130, 200, 221, 211, 154, 4,
                  191, 135, 253, 8, 66, 55, 54, 105, 233, 122, 129, 112, 131,
                  189, 204, 20, 38, 189, 134,
                ]),
              },
              {
                name: '1',
                type: 7,
                size: 1,
                structName: 'Element',
                children: [
                  {
                    name: 'foo',
                    type: 1,
                    size: 1,
                    structName: 'int8',
                    children: [],
                    data: Buffer.from([2]),
                  },
                ],
                typeHash: Uint8Array.from([
                  103, 190, 128, 30, 223, 130, 73, 130, 200, 221, 211, 154, 4,
                  191, 135, 253, 8, 66, 55, 54, 105, 233, 122, 129, 112, 131,
                  189, 204, 20, 38, 189, 134,
                ]),
              },
            ],
          },
        ],
        typeHash: Uint8Array.from([
          243, 134, 66, 40, 32, 207, 243, 77, 238, 52, 92, 94, 101, 102, 129,
          144, 48, 105, 5, 218, 23, 234, 229, 78, 86, 209, 196, 52, 21, 251,
          168, 190,
        ]),
      },
    },
  },
  {
    data: {
      types: {
        Coin: [
          {
            name: 'denom',
            type: 'string',
          },
          {
            name: 'amount',
            type: 'string',
          },
        ],
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'string',
          },
        ],
        Fee: [
          {
            name: 'amount',
            type: 'Coin[]',
          },
          {
            name: 'gas',
            type: 'string',
          },
        ],
        Msg: [
          {
            name: 'type',
            type: 'string',
          },
          {
            name: 'value',
            type: 'MsgValue',
          },
        ],
        MsgValue: [
          {
            name: 'delegator_address',
            type: 'string',
          },
          {
            name: 'validator_address',
            type: 'string',
          },
          {
            name: 'amount',
            type: 'TypeAmount',
          },
        ],
        Tx: [
          {
            name: 'account_number',
            type: 'string',
          },
          {
            name: 'chain_id',
            type: 'string',
          },
          {
            name: 'fee',
            type: 'Fee',
          },
          {
            name: 'memo',
            type: 'string',
          },
          {
            name: 'msgs',
            type: 'Msg[]',
          },
          {
            name: 'sequence',
            type: 'string',
          },
          {
            name: 'timeout_height',
            type: 'string',
          },
        ],
        TypeAmount: [
          {
            name: 'denom',
            type: 'string',
          },
          {
            name: 'amount',
            type: 'string',
          },
        ],
      },
      primaryType: 'Tx',
      domain: {
        name: 'Injective Web3',
        version: '1.0.0',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      },
      message: {
        account_number: '5712',
        chain_id: 'injective-1',
        fee: {
          amount: [
            {
              amount: '200000000000000',
              denom: 'inj',
            },
          ],
          gas: '400000',
        },
        memo: '',
        msgs: [
          {
            type: 'cosmos-sdk/MsgDelegate',
            value: {
              amount: {
                amount: '100000000000000000',
                denom: 'inj',
              },
              delegator_address: 'inj17vy49gw9xnx700z8zwqqv4exl2rgdhanv75c4r',
              validator_address:
                'injvaloper1w3psm8a9td2qz06s46cxss03mz5umxaxegvhhs',
            },
          },
        ],
        sequence: '0',
        timeout_height: '8545415',
      },
    },
    results: {
      domain: {
        name: 'domain',
        type: 7,
        size: 4,
        structName: 'EIP712Domain',
        children: [
          {
            name: 'name',
            type: 3,
            size: 14,
            structName: 'string',
            children: [],
            data: Buffer.from([
              73, 110, 106, 101, 99, 116, 105, 118, 101, 32, 87, 101, 98, 51,
            ]),
          },
          {
            name: 'version',
            type: 3,
            size: 5,
            structName: 'string',
            children: [],
            data: Buffer.from([49, 46, 48, 46, 48]),
          },
          {
            name: 'chainId',
            type: 0,
            size: 32,
            structName: 'uint256',
            children: [],
            data: Buffer.from([
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            ]),
          },
          {
            name: 'verifyingContract',
            type: 3,
            size: 42,
            structName: 'string',
            children: [],
            data: Buffer.from([
              48, 120, 67, 99, 67, 67, 99, 99, 99, 99, 67, 67, 67, 67, 99, 67,
              67, 67, 67, 67, 67, 99, 67, 99, 67, 99, 99, 67, 99, 67, 67, 67,
              99, 67, 99, 99, 99, 99, 99, 99, 99, 67,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          37, 16, 51, 119, 32, 158, 57, 252, 121, 113, 136, 133, 5, 42, 158, 48,
          209, 212, 59, 143, 230, 87, 245, 51, 10, 79, 91, 252, 228, 117, 217,
          13,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 7,
        structName: 'Tx',
        children: [
          {
            name: 'account_number',
            type: 3,
            size: 4,
            structName: 'string',
            children: [],
            data: Buffer.from([53, 55, 49, 50]),
          },
          {
            name: 'chain_id',
            type: 3,
            size: 11,
            structName: 'string',
            children: [],
            data: Buffer.from([
              105, 110, 106, 101, 99, 116, 105, 118, 101, 45, 49,
            ]),
          },
          {
            name: 'fee',
            type: 7,
            size: 2,
            structName: 'Fee',
            children: [
              {
                name: 'amount',
                type: 6,
                size: 1,
                structName: 'Coin[]',
                children: [
                  {
                    name: '0',
                    type: 7,
                    size: 2,
                    structName: 'Coin',
                    children: [
                      {
                        name: 'amount',
                        type: 3,
                        size: 15,
                        structName: 'string',
                        children: [],
                        data: Buffer.from([
                          50, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
                          48, 48,
                        ]),
                      },
                      {
                        name: 'denom',
                        type: 3,
                        size: 3,
                        structName: 'string',
                        children: [],
                        data: Buffer.from([105, 110, 106]),
                      },
                    ],
                    typeHash: Uint8Array.from([
                      88, 14, 1, 89, 14, 241, 94, 117, 102, 131, 128, 85, 78,
                      155, 186, 2, 195, 129, 35, 108, 90, 22, 246, 173, 81, 209,
                      115, 245, 221, 172, 91, 67,
                    ]),
                  },
                ],
              },
              {
                name: 'gas',
                type: 3,
                size: 6,
                structName: 'string',
                children: [],
                data: Buffer.from([52, 48, 48, 48, 48, 48]),
              },
            ],
            typeHash: Uint8Array.from([
              106, 210, 113, 56, 135, 248, 219, 233, 147, 10, 248, 236, 37, 159,
              22, 176, 168, 215, 165, 147, 194, 119, 175, 213, 155, 243, 19, 55,
              104, 193, 45, 95,
            ]),
          },
          {
            name: 'memo',
            type: 3,
            size: 0,
            structName: 'string',
            children: [],
            data: Buffer.from([]),
          },
          {
            name: 'msgs',
            type: 6,
            size: 1,
            structName: 'Msg[]',
            children: [
              {
                name: '0',
                type: 7,
                size: 2,
                structName: 'Msg',
                children: [
                  {
                    name: 'type',
                    type: 3,
                    size: 22,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([
                      99, 111, 115, 109, 111, 115, 45, 115, 100, 107, 47, 77,
                      115, 103, 68, 101, 108, 101, 103, 97, 116, 101,
                    ]),
                  },
                  {
                    name: 'value',
                    type: 7,
                    size: 3,
                    structName: 'MsgValue',
                    children: [
                      {
                        name: 'amount',
                        type: 7,
                        size: 2,
                        structName: 'TypeAmount',
                        children: [
                          {
                            name: 'amount',
                            type: 3,
                            size: 18,
                            structName: 'string',
                            children: [],
                            data: Buffer.from([
                              49, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
                              48, 48, 48, 48, 48, 48,
                            ]),
                          },
                          {
                            name: 'denom',
                            type: 3,
                            size: 3,
                            structName: 'string',
                            children: [],
                            data: Buffer.from([105, 110, 106]),
                          },
                        ],
                        typeHash: Uint8Array.from([
                          40, 207, 48, 91, 40, 136, 92, 110, 43, 40, 209, 2,
                          119, 124, 136, 28, 17, 197, 231, 177, 239, 253, 160,
                          121, 248, 150, 158, 206, 238, 170, 248, 116,
                        ]),
                      },
                      {
                        name: 'delegator_address',
                        type: 3,
                        size: 42,
                        structName: 'string',
                        children: [],
                        data: Buffer.from([
                          105, 110, 106, 49, 55, 118, 121, 52, 57, 103, 119, 57,
                          120, 110, 120, 55, 48, 48, 122, 56, 122, 119, 113,
                          113, 118, 52, 101, 120, 108, 50, 114, 103, 100, 104,
                          97, 110, 118, 55, 53, 99, 52, 114,
                        ]),
                      },
                      {
                        name: 'validator_address',
                        type: 3,
                        size: 49,
                        structName: 'string',
                        children: [],
                        data: Buffer.from([
                          105, 110, 106, 118, 97, 108, 111, 112, 101, 114, 49,
                          119, 51, 112, 115, 109, 56, 97, 57, 116, 100, 50, 113,
                          122, 48, 54, 115, 52, 54, 99, 120, 115, 115, 48, 51,
                          109, 122, 53, 117, 109, 120, 97, 120, 101, 103, 118,
                          104, 104, 115,
                        ]),
                      },
                    ],
                    typeHash: Uint8Array.from([
                      22, 83, 14, 134, 116, 216, 154, 126, 72, 237, 23, 206,
                      241, 255, 223, 250, 192, 9, 149, 187, 218, 52, 163, 187,
                      66, 125, 66, 31, 228, 13, 252, 38,
                    ]),
                  },
                ],
                typeHash: Uint8Array.from([
                  215, 123, 152, 96, 22, 160, 193, 166, 175, 38, 243, 169, 194,
                  60, 166, 10, 103, 183, 96, 151, 109, 101, 220, 177, 59, 226,
                  45, 115, 134, 193, 188, 66,
                ]),
              },
            ],
          },
          {
            name: 'sequence',
            type: 3,
            size: 1,
            structName: 'string',
            children: [],
            data: Buffer.from([48]),
          },
          {
            name: 'timeout_height',
            type: 3,
            size: 7,
            structName: 'string',
            children: [],
            data: Buffer.from([56, 53, 52, 53, 52, 49, 53]),
          },
        ],
        typeHash: Uint8Array.from([
          197, 94, 67, 167, 130, 94, 177, 88, 242, 101, 46, 220, 159, 94, 56,
          39, 51, 188, 91, 81, 41, 115, 122, 179, 241, 127, 231, 105, 3, 98, 39,
          161,
        ]),
      },
    },
  },
  {
    data: {
      types: {
        EIP712Domain: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'version',
            type: 'string',
          },
          {
            name: 'chainId',
            type: 'uint256',
          },
          {
            name: 'verifyingContract',
            type: 'address',
          },
        ],
        Person: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'wallet',
            type: 'address',
          },
        ],
        Mail: [
          {
            name: 'from',
            type: 'Person',
          },
          {
            name: 'to',
            type: 'Person[]',
          },
          {
            name: 'contents',
            type: 'string',
          },
        ],
      },
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0x1e0Ae8205e9726E6F296ab8869160A6423E2337E',
      },
      message: {
        from: {
          name: 'Cow',
          wallet: '0xc0004B62C5A39a728e4Af5bee0c6B4a4E54b15ad',
        },
        to: [
          {
            name: 'Bob',
            wallet: '0x54B0Fa66A065748C40dCA2C7Fe125A2028CF9982',
          },
          {
            name: 'Dave',
            wallet: '0x73d0385F4d8E00C5e6504C6030F47BF6212736A8',
          },
        ],
        contents: 'Hello, guys!',
      },
    },
    results: {
      domain: {
        name: 'domain',
        type: 7,
        size: 4,
        structName: 'EIP712Domain',
        children: [
          {
            name: 'name',
            type: 3,
            size: 10,
            structName: 'string',
            children: [],
            data: Buffer.from([69, 116, 104, 101, 114, 32, 77, 97, 105, 108]),
          },
          {
            name: 'version',
            type: 3,
            size: 1,
            structName: 'string',
            children: [],
            data: Buffer.from([49]),
          },
          {
            name: 'chainId',
            type: 0,
            size: 32,
            structName: 'uint256',
            children: [],
            data: Buffer.from([
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            ]),
          },
          {
            name: 'verifyingContract',
            type: 5,
            size: 20,
            structName: 'address',
            children: [],
            data: Buffer.from([
              30, 10, 232, 32, 94, 151, 38, 230, 242, 150, 171, 136, 105, 22,
              10, 100, 35, 226, 51, 126,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          139, 115, 195, 198, 155, 184, 254, 61, 81, 46, 204, 76, 247, 89, 204,
          121, 35, 159, 123, 23, 155, 15, 250, 202, 169, 167, 93, 82, 43, 57,
          64, 15,
        ]),
      },
      message: {
        name: 'message',
        type: 7,
        size: 3,
        structName: 'Mail',
        children: [
          {
            name: 'from',
            type: 7,
            size: 2,
            structName: 'Person',
            children: [
              {
                name: 'name',
                type: 3,
                size: 3,
                structName: 'string',
                children: [],
                data: Buffer.from([67, 111, 119]),
              },
              {
                name: 'wallet',
                type: 5,
                size: 20,
                structName: 'address',
                children: [],
                data: Buffer.from([
                  192, 0, 75, 98, 197, 163, 154, 114, 142, 74, 245, 190, 224,
                  198, 180, 164, 229, 75, 21, 173,
                ]),
              },
            ],
            typeHash: Uint8Array.from([
              185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
              187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33, 99,
              249, 148, 199, 149, 0,
            ]),
          },
          {
            name: 'to',
            type: 6,
            size: 2,
            structName: 'Person[]',
            children: [
              {
                name: '0',
                type: 7,
                size: 2,
                structName: 'Person',
                children: [
                  {
                    name: 'name',
                    type: 3,
                    size: 3,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([66, 111, 98]),
                  },
                  {
                    name: 'wallet',
                    type: 5,
                    size: 20,
                    structName: 'address',
                    children: [],
                    data: Buffer.from([
                      84, 176, 250, 102, 160, 101, 116, 140, 64, 220, 162, 199,
                      254, 18, 90, 32, 40, 207, 153, 130,
                    ]),
                  },
                ],
                typeHash: Uint8Array.from([
                  185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
                  187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33,
                  99, 249, 148, 199, 149, 0,
                ]),
              },
              {
                name: '1',
                type: 7,
                size: 2,
                structName: 'Person',
                children: [
                  {
                    name: 'name',
                    type: 3,
                    size: 4,
                    structName: 'string',
                    children: [],
                    data: Buffer.from([68, 97, 118, 101]),
                  },
                  {
                    name: 'wallet',
                    type: 5,
                    size: 20,
                    structName: 'address',
                    children: [],
                    data: Buffer.from([
                      115, 208, 56, 95, 77, 142, 0, 197, 230, 80, 76, 96, 48,
                      244, 123, 246, 33, 39, 54, 168,
                    ]),
                  },
                ],
                typeHash: Uint8Array.from([
                  185, 216, 199, 138, 207, 155, 152, 115, 17, 222, 108, 123, 69,
                  187, 106, 156, 142, 27, 243, 97, 250, 127, 211, 70, 122, 33,
                  99, 249, 148, 199, 149, 0,
                ]),
              },
            ],
          },
          {
            name: 'contents',
            type: 3,
            size: 12,
            structName: 'string',
            children: [],
            data: Buffer.from([
              72, 101, 108, 108, 111, 44, 32, 103, 117, 121, 115, 33,
            ]),
          },
        ],
        typeHash: Uint8Array.from([
          221, 87, 217, 89, 106, 245, 43, 67, 12, 237, 61, 91, 82, 212, 227,
          213, 220, 207, 223, 62, 5, 114, 219, 29, 207, 82, 107, 170, 211, 17,
          251, 209,
        ]),
      },
    },
  },
];

export default valid;
