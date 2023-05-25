import { DeviceAppError } from '@cypherock/sdk-interfaces';
import { ITrainJoystickTestCase } from './types';

const withInvalidData = {
  name: 'With invalid data',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([50, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([0, 2, 8, 1]),
    },
  ],
  errorInstance: DeviceAppError,
};

const withInvalidData2 = {
  name: 'With invalid data',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([50, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([
        50, 102, 18, 49, 10, 34, 17, 215, 235, 107, 4, 115, 17, 205, 134, 196,
        94, 184, 190, 92, 122, 157, 104, 140, 18, 11, 67, 121, 112, 104, 101,
        114, 111, 99, 107, 32, 49, 18, 49, 10, 34, 220, 0, 19, 227, 205, 189,
        249, 31, 134, 243, 150, 159, 13, 98, 234, 82, 223, 174, 92, 150, 23,
        139, 97, 22, 254, 174, 195, 229, 34, 36, 218, 36, 163, 192, 18, 11, 67,
        121, 112, 104, 101, 114, 111, 99, 107, 32, 50,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
};

const invalidData: ITrainJoystickTestCase[] = [
  withInvalidData,
  withInvalidData2,
];

export default invalidData;
