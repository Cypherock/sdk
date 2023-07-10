import { hexToUint8Array } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query } from '../../../src/proto/generated/evm/core';
import { AddressFormat } from '../../../src/proto/generated/evm/common';

const requestOneAddress: IGetPublicKeysTestCase = {
  name: 'Request 1 Address',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPaths: [
      {
        path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
      },
    ],
    chainId: 1,
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKeys: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPaths: [
                  {
                    path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
                  },
                ],
                chainId: hexToUint8Array((1).toString(16)),
                format: AddressFormat.DEFAULT,
                doVerify: true,
              },
            },
          }),
        ).finish(),
      ),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([
        10, 46, 10, 44, 10, 42, 48, 120, 68, 53, 57, 55, 49, 57, 52, 56, 51, 49,
        48, 52, 100, 52, 98, 49, 97, 49, 54, 49, 67, 51, 53, 97, 56, 68, 70, 52,
        50, 49, 65, 50, 57, 51, 54, 65, 56, 70, 48, 97,
      ]),
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
        {
          flowStatus: 2,
          expectEventCalls: [2],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4], [5]] },
  output: {
    publicKeys: ['0xD59719483104d4b1a161C35a8DF421A2936A8F0a'],
  },
};

const requestMultipleAddress: IGetPublicKeysTestCase = {
  name: 'Request 3 Addresses',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPaths: [
      {
        path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 1, 0, 0],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 2, 0, 0],
      },
    ],
    chainId: 1666600000,
    format: AddressFormat.HARMONY,
    doVerifyOnDevice: false,
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKeys: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPaths: [
                  {
                    path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
                  },
                  {
                    path: [
                      0x80000000 + 44,
                      0x80000000 + 60,
                      0x80000000 + 1,
                      0,
                      0,
                    ],
                  },
                  {
                    path: [
                      0x80000000 + 44,
                      0x80000000 + 60,
                      0x80000000 + 2,
                      0,
                      0,
                    ],
                  },
                ],
                chainId: hexToUint8Array((1666600000).toString(16)),
                format: AddressFormat.HARMONY,
                doVerify: false,
              },
            },
          }),
        ).finish(),
      ),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([
        10, 135, 1, 10, 132, 1, 10, 42, 111, 110, 101, 49, 54, 107, 116, 51,
        106, 106, 112, 51, 113, 110, 50, 116, 114, 103, 116, 112, 99, 100, 100,
        103, 109, 97, 112, 112, 53, 50, 102, 107, 52, 114, 99, 50, 100, 108,
        100, 102, 48, 107, 10, 42, 111, 110, 101, 49, 52, 116, 55, 103, 118, 97,
        108, 117, 116, 50, 48, 103, 100, 56, 106, 106, 109, 121, 102, 104, 121,
        104, 116, 54, 97, 97, 115, 48, 118, 120, 112, 103, 103, 109, 99, 112,
        107, 103, 10, 42, 111, 110, 101, 49, 54, 106, 54, 48, 101, 52, 53, 50,
        57, 113, 103, 109, 120, 106, 99, 55, 116, 118, 103, 57, 121, 54, 121,
        48, 56, 110, 100, 122, 114, 51, 101, 107, 104, 97, 114, 119, 121, 97,
      ]),
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
        {
          flowStatus: 2,
          expectEventCalls: [2],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4], [5]] },
  output: {
    publicKeys: [
      'one16kt3jjp3qn2trgtpcddgmapp52fk4rc2dldf0k',
      'one14t7gvalut20gd8jjmyfhyht6aas0vxpggmcpkg',
      'one16j60e4529qgmxjc7tvg9y6y08ndzr3ekharwya',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
