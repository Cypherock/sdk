import { createFlowStatus } from '@cypherock/sdk-utils';
import { IGetXpubsTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/btc/core';

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
        path: [0x80000000 + 44, 0x80000000, 0x80000000],
      },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getXpubs: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPaths: [
                  {
                    path: [0x80000000 + 44, 0x80000000, 0x80000000],
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
            getXpubs: {
              result: {
                xpubs: [
                  'xpub6BsXdv4PfBcemMJH8Pea913XswhLexTZQFSbRBbSaJ8jkpyi26r4qA9WALLLSYxiNRp8YiSwPqMuJGCyN6sRWRptY41SAS1Bha2u2yLvGks',
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
  mocks: { eventCalls: [[0], [1], [2], [3]] },
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
        path: [0x80000000 + 44, 0x80000000, 0x80000000],
      },
      {
        path: [0x80000000 + 44, 0x80000000, 0x80000000 + 1],
      },
      {
        path: [0x80000000 + 44, 0x80000000, 0x80000000 + 2],
      },
      {
        path: [0x80000000 + 44, 0x80000000, 0x80000000 + 3],
      },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getXpubs: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPaths: [
                  {
                    path: [0x80000000 + 44, 0x80000000, 0x80000000],
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000, 0x80000000 + 1],
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000, 0x80000000 + 2],
                  },
                  {
                    path: [0x80000000 + 44, 0x80000000, 0x80000000 + 3],
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
            getXpubs: {
              result: {
                xpubs: [
                  'xpub6BsXdv4PfBcemMJH8Pea913XswhLexTZQFSbRBbSaJ8jkpyi26r4qA9WALLLSYxiNRp8YiSwPqMuJGCyN6sRWRptY41SAS1Bha2u2yLvGks',
                  'xpub6BsXdv4PfBceoqbjdgUr2WonPfBm7VHN64kxdzBjBvhcP7KWLRKLRM4MpvQJP5cHfJeJw5BbJNsGtnKCEdQwaZvVP4cbgb15XRS9oi4wj8J',
                  'xpub6BsXdv4PfBcese3x7arVEtwB5PoLn1pdLGjNTfpY2fTDX9VBFVRRjQA76MU8GL1Xbc8HHogjzLMjpCfMnBN9qKsbvvYTCnT7f23yHbXCNPf',
                  'xpub6BsXdv4PfBceujuiTDrhP3dQ3MRk7qRAdEdKhfJmvqPSqN2g9naZ79ZNxRHSSrea3eJEHpusbXMBHCnxuvFtTWqm8aJciNHgXUooXpfFd7U',
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
  mocks: { eventCalls: [[0], [1], [2], [3]] },
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
