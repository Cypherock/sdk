import { IEncryptMessagesParams, IEncryptMessagesResult } from '../../../src';

export interface IEncryptMessagesTestCase {
  name: string;
  params: IEncryptMessagesParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  output?: IEncryptMessagesResult;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IEncryptMessagesTestCase[];
  invalidArgs: IEncryptMessagesTestCase[];
  error: IEncryptMessagesTestCase[];
}
