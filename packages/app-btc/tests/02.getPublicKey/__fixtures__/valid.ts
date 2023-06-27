import { IGetPublicKeyTestCase } from './types';

const requestAddress: IGetPublicKeyTestCase = {
  name: 'Request Address',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [44, 0, 0, 0, 0],
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        10, 60, 10, 58, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220,
        38, 17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8,
        53, 86, 128, 26, 3, 187, 121, 64, 18, 4, 8, 44, 16, 1, 18, 2, 16, 1, 18,
        2, 16, 1, 18, 2, 16, 0, 18, 2, 16, 0,
      ]),
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
    publicKey: '1L8Qb1sKPPNMRbuSTj6W1WXnGfzxrSMfZR',
  },
};

const valid: IGetPublicKeyTestCase[] = [requestAddress];

export default valid;
