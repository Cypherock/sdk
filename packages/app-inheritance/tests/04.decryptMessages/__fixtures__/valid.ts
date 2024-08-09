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
            recovery: {
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
            recovery: {
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
  output: { decryptedData: ['test'] },
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
            recovery: {
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
            recovery: {
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
  output: { decryptedData: ['test', 'new message', 'another message'] },
};

const decryptMultipleMessagesAndGetRaw: IDecryptMessagesTestCase = {
  name: 'Decrypt multiple messages and get raw result',
  params: {
    encryptedData: new Uint8Array([0]),
    getRawData: true,
  },
  queries: [
    {
      name: 'initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            recovery: {
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
            recovery: {
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
  },
};

const valid: IDecryptMessagesTestCase[] = [
  decryptSingeMessage,
  decryptMultipleMessages,
  decryptMultipleMessagesAndGetRaw,
];

export default valid;
