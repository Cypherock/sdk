export interface IGetLogsTestCase {
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
    eventCalls?: number[][];
  };
  errorInstance?: any;
  errorMessage?: any;
  [key: string]: any;
}

export interface IFixtures {
  valid: IGetLogsTestCase[];
  invalidData: IGetLogsTestCase[];
  error: IGetLogsTestCase[];
}
