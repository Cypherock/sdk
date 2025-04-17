import {
  IEncryptMessagesWithPinParams,
  IEncryptMessagesWithPinResult,
} from '../../../src';

export interface IEncryptMessagesTestCase {
  name: string;
  params: IEncryptMessagesWithPinParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  output?: IEncryptMessagesWithPinResult;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IEncryptMessagesTestCase[];
  invalidArgs: IEncryptMessagesTestCase[];
  error: IEncryptMessagesTestCase[];
}
