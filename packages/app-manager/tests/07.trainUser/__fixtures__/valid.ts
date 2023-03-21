import { ITrainUserTestCase } from './types';

const withSuccessfulTraining: ITrainUserTestCase = {
  name: 'With successful training',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([50, 0]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([50, 2, 8, 1]),
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
        {
          flowStatus: 4,
          expectEventCalls: [3, 4],
        },
        {
          flowStatus: 6,
          expectEventCalls: [5, 6],
        },
      ],
    },
  ],
  mocks: {
    eventCalls: [[0], [1], [2], [3], [4], [5], [6]],
  },
  output: {
    isSuccess: true,
    existingWalletList: [],
  },
};

const withExistingWallets: ITrainUserTestCase = {
  name: 'Start from intermediate step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([50, 0]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([
        50, 102, 18, 49, 10, 34, 17, 215, 235, 107, 4, 115, 17, 205, 134, 196,
        58, 17, 233, 14, 107, 101, 78, 228, 136, 121, 168, 85, 46, 2, 106, 191,
        94, 184, 190, 92, 122, 157, 104, 140, 18, 11, 67, 121, 112, 104, 101,
        114, 111, 99, 107, 32, 49, 18, 49, 10, 34, 220, 0, 19, 227, 205, 189,
        249, 31, 134, 243, 150, 159, 13, 98, 234, 82, 223, 174, 92, 150, 23,
        139, 97, 22, 254, 174, 195, 229, 34, 36, 218, 36, 163, 192, 18, 11, 67,
        121, 112, 104, 101, 114, 111, 99, 107, 32, 50,
      ]),
      statuses: [
        {
          flowStatus: 5,
          expectEventCalls: [0, 1, 2, 3, 4, 5],
        },
        {
          flowStatus: 6,
          expectEventCalls: [6],
        },
      ],
    },
  ],
  mocks: {
    eventCalls: [[0], [1], [2], [3], [4], [5], [6]],
  },
  output: {
    isSuccess: false,
    existingWalletList: [
      {
        id: new Uint8Array([
          17, 215, 235, 107, 4, 115, 17, 205, 134, 196, 58, 17, 233, 14, 107,
          101, 78, 228, 136, 121, 168, 85, 46, 2, 106, 191, 94, 184, 190, 92,
          122, 157, 104, 140,
        ]),
        name: 'Cypherock 1',
      },
      {
        id: new Uint8Array([
          220, 0, 19, 227, 205, 189, 249, 31, 134, 243, 150, 159, 13, 98, 234,
          82, 223, 174, 92, 150, 23, 139, 97, 22, 254, 174, 195, 229, 34, 36,
          218, 36, 163, 192,
        ]),
        name: 'Cypherock 2',
      },
    ],
  },
};

const valid: ITrainUserTestCase[] = [
  withSuccessfulTraining,
  withExistingWallets,
];

export default valid;
