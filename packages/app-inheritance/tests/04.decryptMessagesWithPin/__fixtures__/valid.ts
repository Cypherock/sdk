import { createFlowStatus } from '@cypherock/sdk-utils';
import { IDecryptMessagesTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/inheritance/core';

const decryptSingeMessage: IDecryptMessagesTestCase = {
  name: 'Decrypt single message',
  params: {
    encryptedData: new Uint8Array([0]), // TODO: update data
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
                encryptedData: new Uint8Array([0]),
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
  ],
  results: [
    {
      name: 'messages',
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            decrypt: {
              messages: {
                plainData: [
                  {
                    message: Buffer.from('test'),
                  },
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
          flowStatus: createFlowStatus(2, 0),
          expectEventCalls: [2],
        },
        {
          flowStatus: createFlowStatus(3, 0),
          expectEventCalls: [3],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3]] },
  output: {
    decryptedData: [new Uint8Array(Buffer.from('test'))],
    decryptedDataAsStrings: ['test'],
  },
};

const decryptMultipleMessages: IDecryptMessagesTestCase = {
  name: 'Decrypt multiple messages',
  params: {
    encryptedData: new Uint8Array([0]),
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
                encryptedData: new Uint8Array([0]),

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
  ],
  results: [
    {
      name: 'result',
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            decrypt: {
              messages: {
                plainData: [
                  { message: Buffer.from('test') },
                  { message: Buffer.from('new message') },
                  { message: Buffer.from('another message') },
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
          flowStatus: createFlowStatus(2, 0),
          expectEventCalls: [2],
        },
        {
          flowStatus: createFlowStatus(3, 0),
          expectEventCalls: [3],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3]] },
  output: {
    decryptedData: ['test', 'new message', 'another message'].map(
      x => new Uint8Array(Buffer.from(x)),
    ),
    decryptedDataAsStrings: ['test', 'new message', 'another message'],
  },
};

const valid: IDecryptMessagesTestCase[] = [
  decryptSingeMessage,
  decryptMultipleMessages,
];

export default valid;
