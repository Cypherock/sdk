import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/constellation/core';

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
        path: [0x80000000 + 44, 0x80000000 + 1137, 0x80000000, 0, 0],
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
                      0x80000000 + 44,
                      0x80000000 + 1137,
                      0x80000000,
                      0,
                      0,
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
                    '0453bf841534ef1a00112f8605f759a912e77d61ab3e46f57b5c569d01f0fad1c5f3c1a4c19f286354c8a610d4ef51b46939005d8e69e87e18716e73e70427fc20',
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
      '0453bf841534ef1a00112f8605f759a912e77d61ab3e46f57b5c569d01f0fad1c5f3c1a4c19f286354c8a610d4ef51b46939005d8e69e87e18716e73e70427fc20',
    ],
    addresses: ['DAG0zjwxzRBibhm7ZqMnpVcTExrrsFiNtsz2ueCH'],
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
        path: [0x80000000 + 44, 0x80000000 + 1137, 0x80000000, 0, 0],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 1137, 0x80000000, 0, 1],
      },
      {
        path: [0x80000000 + 44, 0x80000000 + 1137, 0x80000000, 0, 2],
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
                      0x80000000 + 44,
                      0x80000000 + 1137,
                      0x80000000,
                      0,
                      0,
                    ],
                  },
                  {
                    path: [
                      0x80000000 + 44,
                      0x80000000 + 1137,
                      0x80000000,
                      0,
                      1,
                    ],
                  },
                  {
                    path: [
                      0x80000000 + 44,
                      0x80000000 + 1137,
                      0x80000000,
                      0,
                      2,
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
                  '0453bf841534ef1a00112f8605f759a912e77d61ab3e46f57b5c569d01f0fad1c5f3c1a4c19f286354c8a610d4ef51b46939005d8e69e87e18716e73e70427fc20',
                  '046f2601dfb506c478d86900dbe9a61e644be556658bbd9d2d542b13efc1e9452e9f55b522b946aff7f9fc7dd2b580f33c08e37104f82d50382230d6c828500f95',
                  '04983b0a9d6a6f2c30b78cef7ec27b6a4fda94e147db327a5a7852b982e2300fc2e37f5719b98112be19661441f4bd85e602b1be1b057d08f932184e12127792dc',
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
      '0453bf841534ef1a00112f8605f759a912e77d61ab3e46f57b5c569d01f0fad1c5f3c1a4c19f286354c8a610d4ef51b46939005d8e69e87e18716e73e70427fc20',
      '046f2601dfb506c478d86900dbe9a61e644be556658bbd9d2d542b13efc1e9452e9f55b522b946aff7f9fc7dd2b580f33c08e37104f82d50382230d6c828500f95',
      '04983b0a9d6a6f2c30b78cef7ec27b6a4fda94e147db327a5a7852b982e2300fc2e37f5719b98112be19661441f4bd85e602b1be1b057d08f932184e12127792dc',
    ],
    addresses: [
      'DAG0zjwxzRBibhm7ZqMnpVcTExrrsFiNtsz2ueCH',
      'DAG3LnxSVL9YHWbFRFBeuBcbTr2e3AYsSkL9Tjv7',
      'DAG219Ebrbo2xE5cUvED9i3rExTCNxmXDbXAhggK',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
