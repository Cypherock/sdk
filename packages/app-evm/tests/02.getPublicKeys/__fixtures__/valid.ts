import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/evm/core';
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
                chainId: (1).toString(),
                format: AddressFormat.DEFAULT,
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
                    '0x032891c403786eed3405bf29304abbcbb5282bc2b30eb3c45759f42bc9bb1b62c6',
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
    addresses: ['0x847d9388Cd7AF9629932907B54d43Be08208dF5a'],
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
    chainId: 1,
    format: AddressFormat.HARMONY,
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
                chainId: (1).toString(),
                format: AddressFormat.HARMONY,
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
                  '0x02a4744ea78a168047e0f5cdbcf4161c88b8b7b2671cd943d4b4d2c4daed5594c0',
                  '0x03c728b86bda7c26d32a5049c25d95f56d23f967ee3cb88467fb3660afedb738f0',
                  '0x02493ebfba970023379dee5197b342ba8c30a5a7f51121fa2a48f49d2db2ea4643',
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
    addresses: [
      '0xCcA852f9Bbc7b4fc753275d8A74BE0a4C200D012',
      '0x911C1279D687b3F596cF1E6a57be7B81F5Dcbeed',
      '0x6a7Fa501F13F83fec0188a61b5B6EaCAA40b93Fd',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
