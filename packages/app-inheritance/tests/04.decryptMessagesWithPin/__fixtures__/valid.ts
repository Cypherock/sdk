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
              encryptedData: {
                packet: new Uint8Array([0]),
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
              plainData: [
                {
                  message: Buffer.from('test'),
                },
              ],
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
              encryptedData: {
                packet: new Uint8Array([0]),
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
              plainData: [
                { message: Buffer.from('test') },
                { message: Buffer.from('new message') },
                { message: Buffer.from('another message') },
              ],
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
