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

const encryptSimpleMessage: IEncryptMessagesTestCase = {
  name: 'Encrypt simple text message',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
    messages: {
      1: { value: 'Hello World' },
    },
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
      data: Uint8Array.from([
        18, 27, 18, 25, 10, 23, 10, 19, 10, 17, 10, 11, 72, 101, 108, 108, 111,
        32, 87, 111, 114, 108, 100, 16, 0, 24, 1, 32, 1,
      ]),
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
        '122a1a280a260a220a20a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b22001',
      ),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    encryptedPacket: hexToUint8Array(
      'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    ),
  },
};

const encryptSpecialCharsMessage: IEncryptMessagesTestCase = {
  name: 'Encrypt message with special characters',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
    messages: {
      1: { value: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
    },
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
      data: Uint8Array.from([
        18, 42, 18, 40, 10, 38, 10, 34, 10, 32, 10, 26, 33, 64, 35, 36, 37, 94,
        38, 42, 40, 41, 95, 43, 45, 61, 91, 93, 123, 125, 124, 59, 58, 44, 46,
        60, 62, 63, 16, 0, 24, 1, 32, 1,
      ]),
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
        '122a1a280a260a220a20f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e22001',
      ),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    encryptedPacket: hexToUint8Array(
      'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2',
    ),
  },
};

const valid: IEncryptMessagesTestCase[] = [
  encryptEmptyMessage,
  encryptSimpleMessage,
  encryptSpecialCharsMessage,
];

export default valid;
