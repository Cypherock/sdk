import { createFlowStatus } from '@cypherock/sdk-utils';
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

const valid: IGetPublicKeyTestCase[] = [requestAddress];

export default valid;
