import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/stellar/core';

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
        path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED: 3 elements for Stellar
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
                    path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED
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
                    'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5', // 32-byte Ed25519 public key
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
      'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5',
    ],
    addresses: ['GA6QXFWB4426O22V72AWT6MHTB6CGVNMHOXGBGAVEC6ZKUPB3UJKKTJC'], // Stellar address format
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
        path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED: m/44'/148'/0'
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 1], // CORRECTED: m/44'/148'/1'
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 2], // CORRECTED: m/44'/148'/2'
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
                    path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 1], // CORRECTED
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 2], // CORRECTED
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
                  'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5',
                  'f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef',
                  'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
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
      'da2bb7324ee1a78bc62ea120b09d8caf3e6bf1ab1906b01a56eacc4a64b00ed5',
      'f1a2b3c4d5e6f7890123456789abcdef0123456789abcdef0123456789abcdef',
      'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    ],
    addresses: [
      'GA6QXFWB4426O22V72AWT6MHTB6CGVNMHOXGBGAVEC6ZKUPB3UJKKTJC',
      'GBV4MITIMOOLIXOUQMUN7F6QA6UTSWWK745SUYUUDUIXTSAM7AOPPYEN',
      'GCKHJFLQNG3RCU7OO5RHJV6XXBBP5HO7GPPUJXDBXBI7OPEILL4ABL5K',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
