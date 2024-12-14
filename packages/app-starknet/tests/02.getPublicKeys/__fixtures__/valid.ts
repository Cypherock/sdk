import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/starknet/core';

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
        path: [
          0x80000000 + 0xa55,
          0x80000000 + 0x4741e9c9,
          0x80000000 + 0x447a6028,
          0x80000000,
          0x80000000,
          0xc,
        ],
      },
    ],
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
                    path: [
                      0x80000000 + 0xa55,
                      0x80000000 + 0x4741e9c9,
                      0x80000000 + 0x447a6028,
                      0x80000000,
                      0x80000000,
                      0xc,
                    ],
                  },
                ],
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
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            getPublicKeys: {
              result: {
                publicKeys: [
                  hexToUint8Array(
                    '032891c403786eed3405bf29304abbcbb5282bc2b30eb3c45759f42bc9bb1b62c6',
                  ),
                ],
              },
            },
          }),
        ).finish(),
      ),
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
          flowStatus: createFlowStatus(2, 1),
          expectEventCalls: [2],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    publicKeys: [
      '0x032891c403786eed3405bf29304abbcbb5282bc2b30eb3c45759f42bc9bb1b62c6',
    ],
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
        path: [
          0x80000000 + 0xa55,
          0x80000000 + 0x4741e9c9,
          0x80000000 + 0x447a6028,
          0x80000000,
          0x80000000,
          0xc,
        ],
      },
      {
        path: [
          0x80000000 + 0xa55,
          0x80000000 + 0x4741e9c9,
          0x80000000 + 0x447a6028,
          0x80000000,
          0x80000000,
          0xd,
        ],
      },
      {
        path: [
          0x80000000 + 0xa55,
          0x80000000 + 0x4741e9c9,
          0x80000000 + 0x447a6028,
          0x80000000,
          0x80000000,
          0xe,
        ],
      },
    ],
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
                    path: [
                      0x80000000 + 0xa55,
                      0x80000000 + 0x4741e9c9,
                      0x80000000 + 0x447a6028,
                      0x80000000,
                      0x80000000,
                      0xc,
                    ],
                  },
                  {
                    path: [
                      0x80000000 + 0xa55,
                      0x80000000 + 0x4741e9c9,
                      0x80000000 + 0x447a6028,
                      0x80000000,
                      0x80000000,
                      0xd,
                    ],
                  },
                  {
                    path: [
                      0x80000000 + 0xa55,
                      0x80000000 + 0x4741e9c9,
                      0x80000000 + 0x447a6028,
                      0x80000000,
                      0x80000000,
                      0xe,
                    ],
                  },
                ],
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
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            getPublicKeys: {
              result: {
                publicKeys: [
                  '02a4744ea78a168047e0f5cdbcf4161c88b8b7b2671cd943d4b4d2c4daed5594c0',
                  '03c728b86bda7c26d32a5049c25d95f56d23f967ee3cb88467fb3660afedb738f0',
                  '02493ebfba970023379dee5197b342ba8c30a5a7f51121fa2a48f49d2db2ea4643',
                ].map(e => hexToUint8Array(e)),
              },
            },
          }),
        ).finish(),
      ),
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
          flowStatus: createFlowStatus(2, 1),
          expectEventCalls: [2],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    publicKeys: [
      '0x02a4744ea78a168047e0f5cdbcf4161c88b8b7b2671cd943d4b4d2c4daed5594c0',
      '0x03c728b86bda7c26d32a5049c25d95f56d23f967ee3cb88467fb3660afedb738f0',
      '0x02493ebfba970023379dee5197b342ba8c30a5a7f51121fa2a48f49d2db2ea4643',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
