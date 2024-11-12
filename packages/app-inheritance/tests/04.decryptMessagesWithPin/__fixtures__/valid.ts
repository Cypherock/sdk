import { createFlowStatus, hexToUint8Array } from '@cypherock/sdk-utils';
import { IDecryptMessagesTestCase } from './types';
import { Query } from '../../../src/proto/generated/inheritance/core';

const decryptEmptyMessage: IDecryptMessagesTestCase = {
  name: 'Decrypt empty message',
  params: {
    encryptedData: hexToUint8Array(
      'cb5bb0f4b2434bae6f6f49700a55cd4f14b1fd682e0506df66da8a2d3d18094d',
    ),
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
  },
  queries: [
    {
      name: 'initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            decrypt: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187,
                ]),
              },
            },
          }),
        ).finish(),
      ),
    },
    {
      name: 'send chunk',
      data: hexToUint8Array(
        '1a2a12280a260a220a20cb5bb0f4b2434bae6f6f49700a55cd4f14b1fd682e0506df66da8a2d3d18094d2001',
      ),
    },
    {
      name: 'request chunk',
      data: hexToUint8Array('1a041a020a00'),
    },
  ],
  results: [
    {
      name: 'send confirmation',
      data: hexToUint8Array('1a020a00'),
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
          flowStatus: createFlowStatus(2, 0),
          expectEventCalls: [2],
        },
        {
          flowStatus: createFlowStatus(3, 0),
          expectEventCalls: [3],
        },
      ],
    },
    {
      name: 'send chunk',
      data: hexToUint8Array('1a0412020a00'),
    },
    {
      name: 'request chunk',
      data: hexToUint8Array('1a041a020a00'),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3]] },
  output: {},
};

// TODO: Add more cases
const valid: IDecryptMessagesTestCase[] = [decryptEmptyMessage];

export default valid;
