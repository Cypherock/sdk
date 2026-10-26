import { GetDeviceInfoResult } from '../../../src';

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
    verifySerialSignatureCalls?: any[][];
    verifyChallengeSignatureCalls?: any[][];
    deviceInfo: Partial<GetDeviceInfoResult>;
  };
  errorInstance?: any;
  errorMessage?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IAuthDeviceTestCase[];
  invalidData: IAuthDeviceTestCase[];
  error: IAuthDeviceTestCase[];
}
