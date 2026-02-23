import { createFlowStatus } from '@cypherock/sdk-utils';
import { IGetPublicKeyTestCase } from './types';
import { Query } from '../../../src/proto/generated/btc/core';

const requestPublicKeyAndAddress: IGetPublicKeyTestCase = {
  name: 'Request Public Key and Address',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 0, 0],
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
                derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 0, 0],
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
        10, 105, 10, 103, 10, 65, 4, 213, 142, 30, 138, 1, 14, 51, 201, 110, 13,
        175, 117, 169, 164, 195, 10, 80, 185, 29, 225, 243, 140, 234, 62, 2,
        113, 160, 3, 0, 24, 67, 112, 122, 209, 115, 117, 147, 114, 244, 145,
        194, 157, 62, 139, 85, 72, 1, 9, 41, 120, 223, 115, 142, 210, 212, 60,
        96, 7, 197, 15, 51, 21, 132, 183, 18, 34, 49, 57, 118, 56, 112, 101, 49,
        84, 86, 109, 84, 109, 88, 111, 50, 50, 97, 104, 76, 112, 78, 89, 104,
        103, 66, 54, 70, 88, 102, 107, 78, 112, 119, 106,
      ]),
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
    publicKey: new Uint8Array([
      4, 213, 142, 30, 138, 1, 14, 51, 201, 110, 13, 175, 117, 169, 164, 195,
      10, 80, 185, 29, 225, 243, 140, 234, 62, 2, 113, 160, 3, 0, 24, 67, 112,
      122, 209, 115, 117, 147, 114, 244, 145, 194, 157, 62, 139, 85, 72, 1, 9,
      41, 120, 223, 115, 142, 210, 212, 60, 96, 7, 197, 15, 51, 21, 132, 183,
    ]),
    address: '19v8pe1TVmTmXo22ahLpNYhgB6FXfkNpwj',
  },
};

const requestPublicKeyAndDeriveAddress: IGetPublicKeyTestCase = {
  name: 'Request Public Key and Derive Address',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 0, 0],
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
                derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 0, 0],
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
        10, 37, 10, 35, 10, 33, 3, 41, 155, 232, 126, 245, 18, 49, 110, 235,
        225, 178, 60, 48, 53, 109, 26, 117, 222, 193, 192, 185, 147, 11, 59,
        191, 155, 17, 129, 230, 183, 171, 92,
      ]),
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
    publicKey: new Uint8Array([
      3, 41, 155, 232, 126, 245, 18, 49, 110, 235, 225, 178, 60, 48, 53, 109,
      26, 117, 222, 193, 192, 185, 147, 11, 59, 191, 155, 17, 129, 230, 183,
      171, 92,
    ]),
    address: '1B87oKEs97mnEC9zi2Pkn8BNT9cAExEqYF',
  },
};

const valid: IGetPublicKeyTestCase[] = [
  requestPublicKeyAndAddress,
  requestPublicKeyAndDeriveAddress,
];

export default valid;
