import { createFlowStatus } from '@cypherock/sdk-utils';
import { IEncryptMessagesTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/inheritance/core';

const encryptSingeMessage: IEncryptMessagesTestCase = {
  name: 'Encrypt single message',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
    messages: [{ value: 'test' }],
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
                plainData: [
                  { message: Buffer.from('test'), isVerifiedOnDevice: false },
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
            encrypt: {
              result: {
                encryptedData: new Uint8Array([0]), // dummy data, encrypted data actually depends on session
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
        {
          flowStatus: createFlowStatus(4, 0),
          expectEventCalls: [4],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: { encryptedPacket: new Uint8Array([0]) },
};

const encryptMultipleMessages: IEncryptMessagesTestCase = {
  name: 'Encrypt multiple messages',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
    messages: [
      { value: 'test' },
      { value: 'something else' },
      {
        value: 'something other than something else',
        verifyOnDevice: true,
      },
    ],
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
                plainData: [
                  { message: Buffer.from('test'), isVerifiedOnDevice: false },
                  {
                    message: Buffer.from('something else'),
                    isVerifiedOnDevice: false,
                  },
                  {
                    message: Buffer.from('something other than something else'),
                    isVerifiedOnDevice: true,
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
            encrypt: {
              result: {
                encryptedData: new Uint8Array([0]), // dummy data, encrypted data actually depends on session
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
        {
          flowStatus: createFlowStatus(4, 0),
          expectEventCalls: [4],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: { encryptedPacket: new Uint8Array([0]) },
};

const valid: IEncryptMessagesTestCase[] = [
  encryptSingeMessage,
  encryptMultipleMessages,
];

export default valid;
