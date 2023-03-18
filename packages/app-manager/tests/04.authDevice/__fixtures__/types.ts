import { IGetDeviceInfoResponse } from '../../../src';

export interface IAuthDeviceTestCase {
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  mocks: {
    challenge?: Uint8Array;
    challengeVerified?: boolean;
    eventCalls?: number[][];
    deviceInfo: Partial<IGetDeviceInfoResponse>;
  };
  errorInstance?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IAuthDeviceTestCase[];
  error: IAuthDeviceTestCase[];
}
