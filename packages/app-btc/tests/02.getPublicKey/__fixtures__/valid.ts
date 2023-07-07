import { IGetPublicKeyTestCase } from './types';
import { Query } from '../../../src/proto/generated/btc/core';

const requestAddress: IGetPublicKeyTestCase = {
  name: 'Request Address',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [
      0x8000002c, 0x80000000, 0x80000000, 0x80000000, 0x80000000,
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKey: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPath: [
                  0x8000002c, 0x80000000, 0x80000000, 0x80000000, 0x80000000,
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
      data: new Uint8Array([
        10, 38, 10, 36, 10, 34, 49, 76, 56, 81, 98, 49, 115, 75, 80, 80, 78, 77,
        82, 98, 117, 83, 84, 106, 54, 87, 49, 87, 88, 110, 71, 102, 122, 120,
        114, 83, 77, 102, 90, 82,
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
    publicKey: new TextEncoder().encode('1L8Qb1sKPPNMRbuSTj6W1WXnGfzxrSMfZR'),
  },
};

const valid: IGetPublicKeyTestCase[] = [requestAddress];

export default valid;
