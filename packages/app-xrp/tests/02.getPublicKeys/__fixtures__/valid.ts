import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/xrp/core';

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
        path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 0],
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
                    path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 0],
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
                    '027497533006d024ffb612a2110eb327ccfeed2b752d787c96ab2d3cca425a40e8',
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
      '027497533006d024ffb612a2110eb327ccfeed2b752d787c96ab2d3cca425a40e8',
    ],
    addresses: ['rQGDkQchoJxMSLZR7q9GwvY3iKtDqTUYNQ'],
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
        path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 0],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 1],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 2],
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
                    path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 0],
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 1],
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 2],
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
                  '027497533006d024ffb612a2110eb327ccfeed2b752d787c96ab2d3cca425a40e8',
                  '02fb3fc84979c18fe238a752c862b0babf376e7547544624b265c57568741bc9b9',
                  '0339f6c6fbd07700b15d3e9b199bffc21d5b46df1c488348c38941ab89d394a356',
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
      '027497533006d024ffb612a2110eb327ccfeed2b752d787c96ab2d3cca425a40e8',
      '02fb3fc84979c18fe238a752c862b0babf376e7547544624b265c57568741bc9b9',
      '0339f6c6fbd07700b15d3e9b199bffc21d5b46df1c488348c38941ab89d394a356',
    ],
    addresses: [
      'rQGDkQchoJxMSLZR7q9GwvY3iKtDqTUYNQ',
      'rEgfV7YeyG4YayQQufxaqDx4aUA93SidLb',
      'rpJwv4oLgQDh3TVaWuQpAP5VQYecwsK8rx',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
