import { createFlowStatus, hexToUint8Array } from '@cypherock/sdk-utils';
import { IEncryptMessagesTestCase } from './types';
import { Query } from '../../../src/proto/generated/inheritance/core';

const encryptEmptyMessage: IEncryptMessagesTestCase = {
  name: 'Encrypt empty message',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
    messages: {},
  },
  queries: [
    {
      name: 'initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            encrypt: {
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
      data: hexToUint8Array('120612040a022001'),
    },
    {
      name: 'request chunk',
      data: hexToUint8Array('12041a020a00'),
    },
  ],
  results: [
    {
      name: 'confirmation',
      data: hexToUint8Array('12020a00'),
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
        {
          flowStatus: createFlowStatus(4, 0),
          expectEventCalls: [4],
        },
      ],
    },
    {
      name: 'chunk ack',
      data: hexToUint8Array('120412020a00'),
    },
    {
      name: 'result',
      data: hexToUint8Array(
        '122a1a280a260a220a20cb5bb0f4b2434bae6f6f49700a55cd4f14b1fd682e0506df66da8a2d3d18094d2001',
      ),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    encryptedPacket: hexToUint8Array(
      'cb5bb0f4b2434bae6f6f49700a55cd4f14b1fd682e0506df66da8a2d3d18094d',
    ),
  },
};

// TODO: Add more cases
const valid: IEncryptMessagesTestCase[] = [encryptEmptyMessage];

export default valid;
