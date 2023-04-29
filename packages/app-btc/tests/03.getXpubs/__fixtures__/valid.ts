import { IGetXpubsTestCase } from './types';

const requestOneXpub: IGetXpubsTestCase = {
  name: 'Request 1 xpub',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPaths: [
      {
        path: [
          { index: 44, isHardened: true },
          { index: 0, isHardened: true },
          { index: 0, isHardened: true },
        ],
      },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        18, 54, 10, 52, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220,
        38, 17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8,
        53, 86, 128, 26, 3, 187, 121, 64, 18, 14, 10, 4, 8, 44, 16, 1, 10, 2,
        16, 1, 10, 2, 16, 1,
      ]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([
        18, 115, 10, 113, 10, 111, 120, 112, 117, 98, 54, 66, 115, 88, 100, 118,
        52, 80, 102, 66, 99, 101, 109, 77, 74, 72, 56, 80, 101, 97, 57, 49, 51,
        88, 115, 119, 104, 76, 101, 120, 84, 90, 81, 70, 83, 98, 82, 66, 98, 83,
        97, 74, 56, 106, 107, 112, 121, 105, 50, 54, 114, 52, 113, 65, 57, 87,
        65, 76, 76, 76, 83, 89, 120, 105, 78, 82, 112, 56, 89, 105, 83, 119, 80,
        113, 77, 117, 74, 71, 67, 121, 78, 54, 115, 82, 87, 82, 112, 116, 89,
        52, 49, 83, 65, 83, 49, 66, 104, 97, 50, 117, 50, 121, 76, 118, 71, 107,
        115,
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
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    xpubs: [
      'xpub6BsXdv4PfBcemMJH8Pea913XswhLexTZQFSbRBbSaJ8jkpyi26r4qA9WALLLSYxiNRp8YiSwPqMuJGCyN6sRWRptY41SAS1Bha2u2yLvGks',
    ],
  },
};

const requestFourXpubs: IGetXpubsTestCase = {
  name: 'Request 4 xpubs',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPaths: [
      {
        path: [
          { index: 44, isHardened: true },
          { index: 0, isHardened: true },
          { index: 0, isHardened: true },
        ],
      },
      {
        path: [
          { index: 44, isHardened: true },
          { index: 0, isHardened: true },
          { index: 1, isHardened: true },
        ],
      },
      {
        path: [
          { index: 44, isHardened: true },
          { index: 0, isHardened: true },
          { index: 2, isHardened: true },
        ],
      },
      {
        path: [
          { index: 44, isHardened: true },
          { index: 0, isHardened: true },
          { index: 3, isHardened: true },
        ],
      },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        18, 108, 10, 106, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220,
        38, 17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8,
        53, 86, 128, 26, 3, 187, 121, 64, 18, 14, 10, 4, 8, 44, 16, 1, 10, 2,
        16, 1, 10, 2, 16, 1, 18, 16, 10, 4, 8, 44, 16, 1, 10, 2, 16, 1, 10, 4,
        8, 1, 16, 1, 18, 16, 10, 4, 8, 44, 16, 1, 10, 2, 16, 1, 10, 4, 8, 2, 16,
        1, 18, 16, 10, 4, 8, 44, 16, 1, 10, 2, 16, 1, 10, 4, 8, 3, 16, 1,
      ]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([
        18, 199, 3, 10, 196, 3, 10, 111, 120, 112, 117, 98, 54, 66, 115, 88,
        100, 118, 52, 80, 102, 66, 99, 101, 109, 77, 74, 72, 56, 80, 101, 97,
        57, 49, 51, 88, 115, 119, 104, 76, 101, 120, 84, 90, 81, 70, 83, 98, 82,
        66, 98, 83, 97, 74, 56, 106, 107, 112, 121, 105, 50, 54, 114, 52, 113,
        65, 57, 87, 65, 76, 76, 76, 83, 89, 120, 105, 78, 82, 112, 56, 89, 105,
        83, 119, 80, 113, 77, 117, 74, 71, 67, 121, 78, 54, 115, 82, 87, 82,
        112, 116, 89, 52, 49, 83, 65, 83, 49, 66, 104, 97, 50, 117, 50, 121, 76,
        118, 71, 107, 115, 10, 111, 120, 112, 117, 98, 54, 66, 115, 88, 100,
        118, 52, 80, 102, 66, 99, 101, 111, 113, 98, 106, 100, 103, 85, 114, 50,
        87, 111, 110, 80, 102, 66, 109, 55, 86, 72, 78, 54, 52, 107, 120, 100,
        122, 66, 106, 66, 118, 104, 99, 80, 55, 75, 87, 76, 82, 75, 76, 82, 77,
        52, 77, 112, 118, 81, 74, 80, 53, 99, 72, 102, 74, 101, 74, 119, 53, 66,
        98, 74, 78, 115, 71, 116, 110, 75, 67, 69, 100, 81, 119, 97, 90, 118,
        86, 80, 52, 99, 98, 103, 98, 49, 53, 88, 82, 83, 57, 111, 105, 52, 119,
        106, 56, 74, 10, 111, 120, 112, 117, 98, 54, 66, 115, 88, 100, 118, 52,
        80, 102, 66, 99, 101, 115, 101, 51, 120, 55, 97, 114, 86, 69, 116, 119,
        66, 53, 80, 111, 76, 110, 49, 112, 100, 76, 71, 106, 78, 84, 102, 112,
        89, 50, 102, 84, 68, 88, 57, 86, 66, 70, 86, 82, 82, 106, 81, 65, 55,
        54, 77, 85, 56, 71, 76, 49, 88, 98, 99, 56, 72, 72, 111, 103, 106, 122,
        76, 77, 106, 112, 67, 102, 77, 110, 66, 78, 57, 113, 75, 115, 98, 118,
        118, 89, 84, 67, 110, 84, 55, 102, 50, 51, 121, 72, 98, 88, 67, 78, 80,
        102, 10, 111, 120, 112, 117, 98, 54, 66, 115, 88, 100, 118, 52, 80, 102,
        66, 99, 101, 117, 106, 117, 105, 84, 68, 114, 104, 80, 51, 100, 81, 51,
        77, 82, 107, 55, 113, 82, 65, 100, 69, 100, 75, 104, 102, 74, 109, 118,
        113, 80, 83, 113, 78, 50, 103, 57, 110, 97, 90, 55, 57, 90, 78, 120, 82,
        72, 83, 83, 114, 101, 97, 51, 101, 74, 69, 72, 112, 117, 115, 98, 88,
        77, 66, 72, 67, 110, 120, 117, 118, 70, 116, 84, 87, 113, 109, 56, 97,
        74, 99, 105, 78, 72, 103, 88, 85, 111, 111, 88, 112, 102, 70, 100, 55,
        85,
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
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    xpubs: [
      'xpub6BsXdv4PfBcemMJH8Pea913XswhLexTZQFSbRBbSaJ8jkpyi26r4qA9WALLLSYxiNRp8YiSwPqMuJGCyN6sRWRptY41SAS1Bha2u2yLvGks',
      'xpub6BsXdv4PfBceoqbjdgUr2WonPfBm7VHN64kxdzBjBvhcP7KWLRKLRM4MpvQJP5cHfJeJw5BbJNsGtnKCEdQwaZvVP4cbgb15XRS9oi4wj8J',
      'xpub6BsXdv4PfBcese3x7arVEtwB5PoLn1pdLGjNTfpY2fTDX9VBFVRRjQA76MU8GL1Xbc8HHogjzLMjpCfMnBN9qKsbvvYTCnT7f23yHbXCNPf',
      'xpub6BsXdv4PfBceujuiTDrhP3dQ3MRk7qRAdEdKhfJmvqPSqN2g9naZ79ZNxRHSSrea3eJEHpusbXMBHCnxuvFtTWqm8aJciNHgXUooXpfFd7U',
    ],
  },
};

const valid: IGetXpubsTestCase[] = [requestOneXpub, requestFourXpubs];

export default valid;
