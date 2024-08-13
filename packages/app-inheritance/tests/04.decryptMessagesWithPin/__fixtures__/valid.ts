import { IDecryptMessagesTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/inheritance/core';

const decryptSingeMessage: IDecryptMessagesTestCase = {
  name: 'Decrypt single message',
  params: {
    encryptedData: new Uint8Array([0]), // TODO: update data
  },
  queries: [
    {
      name: 'initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            decrypt: {
              initiate: {
                encryptedData: {
                  packet: new Uint8Array([0]),
                },
              },
            },
          }),
        ).finish(),
      ),
    },
    {
      name: 'ack query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            decrypt: {
              ack: {},
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
    },
    {
      name: 'ack',
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            decrypt: {
              ack: {},
            },
          }),
        ).finish(),
      ),
    },
  ],
  output: {
    decryptedData: [new Uint8Array(Buffer.from('test'))],
    decryptedDataAsStrings: ['test'],
  },
};

const decryptMultipleMessages: IDecryptMessagesTestCase = {
  name: 'Decrypt multiple messages',
  params: {
    encryptedData: new Uint8Array([0]),
  },
  queries: [
    {
      name: 'initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            decrypt: {
              initiate: {
                encryptedData: {
                  packet: new Uint8Array([0]),
                },
              },
            },
          }),
        ).finish(),
      ),
    },
    {
      name: 'ack',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            decrypt: {
              ack: {},
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
    },
    {
      name: 'ack',
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            decrypt: {
              ack: {},
            },
          }),
        ).finish(),
      ),
    },
  ],
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
