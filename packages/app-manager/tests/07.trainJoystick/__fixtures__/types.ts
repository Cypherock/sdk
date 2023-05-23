export interface ITrainJoystickTestCase {
  name: string;
  params?: { jumpToState?: number };
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
  [key: string]: any;
}

export interface IFixtures {
  valid: ITrainJoystickTestCase[];
  invalidData: ITrainJoystickTestCase[];
  error: ITrainJoystickTestCase[];
}
