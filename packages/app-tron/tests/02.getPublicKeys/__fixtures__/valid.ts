import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/tron/core';

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
        path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
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
                    path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
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
                    '041ef173e9ee59422e64855a3d6d96eb9e914ad8199484192e67d17761103405861afd456bfd1904707f018c3c17f98c301c1c07f2ac94f15e5fcb7c297fcaf3e8',
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
      '041ef173e9ee59422e64855a3d6d96eb9e914ad8199484192e67d17761103405861afd456bfd1904707f018c3c17f98c301c1c07f2ac94f15e5fcb7c297fcaf3e8',
    ],
    addresses: ['TCBrhNJQDee7qyeBDyRSh6a4HH1cArZFVo'],
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
        path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 1],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 2],
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
                    path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 1],
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 2],
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
                  '04b3017fd59ba187b9403a307a09a1176e4795a5056f9099a6ef362d46a9b73bb33a58892e84a5baeb1197a5de412b2f1ee7c460ebb73b250c206d39a2142d76f1',
                  '04f0163e6d2e126b81f9a5e13508ed9fccf6abe96bbcf1e23222ea584a0ea02ad15871a3d0e59461d7119327a876f1f025c6006aca8285685e6b4e6095edb63840',
                  '041516fbbb0c3c4b0a9c9c1fbea763efa65d973fa703433544d9335a63096f4cacff8ffd7213fc194a12ec5da22e165c1ecb182ddb682fc934d7131a7cea80933f',
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
      '04b3017fd59ba187b9403a307a09a1176e4795a5056f9099a6ef362d46a9b73bb33a58892e84a5baeb1197a5de412b2f1ee7c460ebb73b250c206d39a2142d76f1',
      '04f0163e6d2e126b81f9a5e13508ed9fccf6abe96bbcf1e23222ea584a0ea02ad15871a3d0e59461d7119327a876f1f025c6006aca8285685e6b4e6095edb63840',
      '041516fbbb0c3c4b0a9c9c1fbea763efa65d973fa703433544d9335a63096f4cacff8ffd7213fc194a12ec5da22e165c1ecb182ddb682fc934d7131a7cea80933f',
    ],
    addresses: [
      'TFouuNaiuFHUXLLf7DyLo43rmp9ubKFmWZ',
      'TQhLdt52oiokRQtoAG2mu9K7vXANun2URn',
      'TUdPfHkkFKa3NqPh1LyYHxeDcvmnD687y6',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
