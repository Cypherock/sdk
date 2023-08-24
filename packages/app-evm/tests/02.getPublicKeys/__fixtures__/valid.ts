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
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            getPublicKeys: {
              result: {
                publicKeys: [
                  hexToUint8Array('0xd59719483104d4b1a161c35a8df421a2936a8f0a'),
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
    publicKeys: ['0xd59719483104d4b1a161c35a8df421a2936a8f0a'],
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
                chainId: (1666600000).toString(),
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
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            getPublicKeys: {
              result: {
                publicKeys: [
                  '0xa24ba3d47fd7a5e086f1495cd4eb00dd232eee1f',
                  '0x6294840c1676afd973c1f248b3b6b5f58e638f85',
                  '0x8d4ee18988f577746438216a4f0a7037809ec9bf',
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
      '0xa24ba3d47fd7a5e086f1495cd4eb00dd232eee1f',
      '0x6294840c1676afd973c1f248b3b6b5f58e638f85',
      '0x8d4ee18988f577746438216a4f0a7037809ec9bf',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
