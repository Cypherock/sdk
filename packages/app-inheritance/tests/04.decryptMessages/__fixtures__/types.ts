import { IDecryptMessagesParams, IDecryptMessagesResult } from '../../../src';

export interface IDecryptMessagesTestCase {
  name: string;
  params: IDecryptMessagesParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  output?: IDecryptMessagesResult;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IDecryptMessagesTestCase[];
  invalidArgs: IDecryptMessagesTestCase[];
  error: IDecryptMessagesTestCase[];
}
