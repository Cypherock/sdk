export interface IAuthCardTestCase {
  params?: {
    cardNumber?: number;
  };
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  mocks?: {
    challenge?: Uint8Array;
    challengeVerified?: boolean;
    verifySerialSignatureCalls?: any[][];
    verifyChallengeSignatureCalls?: any[][];
    eventCalls?: number[][];
  };
  errorInstance?: any;
  errorMessage?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IAuthCardTestCase[];
  invalidData: IAuthCardTestCase[];
  error: IAuthCardTestCase[];
  invalidArgs: IAuthCardTestCase[];
}
