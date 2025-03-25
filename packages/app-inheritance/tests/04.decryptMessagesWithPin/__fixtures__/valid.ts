import { createFlowStatus, hexToUint8Array } from '@cypherock/sdk-utils';
import { IDecryptMessagesTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/inheritance/core';
import { DecryptDataWithPinDecryptedDataStructure } from '../../../src/proto/generated/inheritance/decrypt_data_with_pin';

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

function encodeDecryptedData(
  messages: { tag: number; message: Uint8Array }[],
): Uint8Array {
  const decryptedData = DecryptDataWithPinDecryptedDataStructure.encode({
    decryptedData: messages,
  }).finish();
  return Result.encode({
    decrypt: {
      decryptedData: {
        chunkPayload: {
          chunk: decryptedData,
          chunkIndex: 0,
          totalChunks: 1,
          remainingSize: 0,
        },
      },
    },
  }).finish();
}

const decryptSimpleMessage: IDecryptMessagesTestCase = {
  name: 'Decrypt simple text message',
  params: {
    encryptedData: hexToUint8Array(
      'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
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
        '1a2a12280a260a220a20a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b22001',
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
      data: encodeDecryptedData([
        { tag: 1, message: Buffer.from('Hello World') },
      ]),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3]] },
  output: {
    1: {
      data: new Uint8Array(Buffer.from('Hello World')),
      dataAsString: 'Hello World',
    },
  },
};

const decryptSpecialCharsMessage: IDecryptMessagesTestCase = {
  name: 'Decrypt message with special characters',
  params: {
    encryptedData: hexToUint8Array(
      'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e2',
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
        '1a2a12280a260a220a20f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e22001',
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
      data: encodeDecryptedData([
        { tag: 1, message: Buffer.from('!@#$%^&*()_+-=[]{}|;:,.<>?') },
      ]),
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3]] },
  output: {
    1: {
      data: new Uint8Array(Buffer.from('!@#$%^&*()_+-=[]{}|;:,.<>?')),
      dataAsString: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    },
  },
};

const valid: IDecryptMessagesTestCase[] = [
  decryptEmptyMessage,
  decryptSimpleMessage,
  decryptSpecialCharsMessage,
];

export default valid;
