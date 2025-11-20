import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeysTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/sia/core';

const requestOneAddress: IGetPublicKeysTestCase = {
  name: 'Request 1 Address',
  params: {
    walletId: new Uint8Array([
      166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217, 116,
      107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58, 1, 150, 199,
    ]),
    derivationPaths: [
      {
        path: [0], // Single element for Sia
      },
    ],
  },
  queries: [
    {
      name: 'Initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKeys: {
              initiate: {
                walletId: new Uint8Array([
                  166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8,
                  217, 116, 107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199,
                  175, 58, 1, 150, 199,
                ]),
                derivationPaths: [
                  {
                    path: [0],
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
                    '337ed9f9c647a7c96999998e087ef74281bacb5650ee0afbe27c22399dc31ff1', // Real Sia public key
                  ),
                ],
                addresses: [
                  'a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa71e6a2b35314', // Real Sia address
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
      '337ed9f9c647a7c96999998e087ef74281bacb5650ee0afbe27c22399dc31ff1',
    ],
    addresses: [
      'a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa71e6a2b35314',
    ],
  },
};

const requestMultipleAddress: IGetPublicKeysTestCase = {
  name: 'Request 3 Addresses',
  params: {
    walletId: new Uint8Array([
      166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217, 116,
      107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58, 1, 150, 199,
    ]),
    derivationPaths: [
      {
        path: [0], // Sia index 0
      },
      {
        path: [1], // Sia index 1
      },
      {
        path: [2], // Sia index 2
      },
    ],
  },
  queries: [
    {
      name: 'Initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKeys: {
              initiate: {
                walletId: new Uint8Array([
                  166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8,
                  217, 116, 107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199,
                  175, 58, 1, 150, 199,
                ]),
                derivationPaths: [
                  {
                    path: [0],
                  },
                  {
                    path: [1],
                  },
                  {
                    path: [2],
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
                  // Real public keys from hardware wallet
                  hexToUint8Array(
                    '337ed9f9c647a7c96999998e087ef74281bacb5650ee0afbe27c22399dc31ff1',
                  ),
                  hexToUint8Array(
                    '314402205d621f17c789a608a9e5a007bc11c2ac44f9199d2dc757e24d08aa4e',
                  ),
                  hexToUint8Array(
                    '03116f98fb6c104a930a76ed056ea3de2402aa87830f5c3f0ebe2f8fb2c6875c',
                  ),
                ],
                addresses: [
                  // Real Sia addresses from hardware wallet
                  'a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa71e6a2b35314',
                  '2cce204c8a29ff101ac5eedb8369f134f681f48daa781a08a978581a12ade77b524fa1bd3f98',
                  'ba18856b89475befe648bc6a0e22721bf746b0bee5d5f5a44823aea73c6222eb804cadb3efde',
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
      '337ed9f9c647a7c96999998e087ef74281bacb5650ee0afbe27c22399dc31ff1',
      '314402205d621f17c789a608a9e5a007bc11c2ac44f9199d2dc757e24d08aa4e',
      '03116f98fb6c104a930a76ed056ea3de2402aa87830f5c3f0ebe2f8fb2c6875c',
    ],
    addresses: [
      'a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa71e6a2b35314',
      '2cce204c8a29ff101ac5eedb8369f134f681f48daa781a08a978581a12ade77b524fa1bd3f98',
      'ba18856b89475befe648bc6a0e22721bf746b0bee5d5f5a44823aea73c6222eb804cadb3efde',
    ],
  },
};

const valid: IGetPublicKeysTestCase[] = [
  requestOneAddress,
  requestMultipleAddress,
];

export default valid;
