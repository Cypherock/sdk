import { ITrainJoystickTestCase } from './types';

const withSuccessfulTraining: ITrainJoystickTestCase = {
  name: 'With successful training',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([50, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([50, 2, 10, 0]),
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
        {
          flowStatus: 2,
          expectEventCalls: [2],
        },
        {
          flowStatus: 4,
          expectEventCalls: [3, 4],
        },
      ],
    },
  ],
  mocks: {
    eventCalls: [[0], [1], [2], [3], [4], [5]],
  },
};

const valid: ITrainJoystickTestCase[] = [withSuccessfulTraining];

export default valid;
