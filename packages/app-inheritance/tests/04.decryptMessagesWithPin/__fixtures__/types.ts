import {
  IDecryptMessagesWithPinParams,
  IDecryptMessagesWithPinResult,
} from '../../../src';

export interface IDecryptMessagesTestCase {
  name: string;
  params: IDecryptMessagesWithPinParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  output?: IDecryptMessagesWithPinResult;
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IDecryptMessagesTestCase[];
  invalidArgs: IDecryptMessagesTestCase[];
  error: IDecryptMessagesTestCase[];
}
