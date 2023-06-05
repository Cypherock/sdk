import { DeviceAppError } from '@cypherock/sdk-interfaces';
import { ITrainCardTestCase } from './types';

const invalidData: ITrainCardTestCase[] = [
  {
    name: 'Invalid data',
    queries: [{ name: 'Initiate', data: new Uint8Array([58, 2, 10, 0]) }],
    results: [
      {
        name: 'Result',
        data: new Uint8Array([
          18, 29, 34, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211,
          254,
        ]),
      },
    ],
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    queries: [{ name: 'Initiate', data: new Uint8Array([58, 2, 10, 0]) }],
    results: [{ name: 'Result', data: new Uint8Array([58, 3, 10, 0]) }],
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    queries: [{ name: 'Initiate', data: new Uint8Array([58, 2, 10, 0]) }],
    results: [{ name: 'Result', data: new Uint8Array([58]) }],
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    queries: [{ name: 'Initiate', data: new Uint8Array([58, 2, 10, 0]) }],
    results: [{ name: 'Result', data: new Uint8Array([]) }],
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    queries: [{ name: 'Initiate', data: new Uint8Array([58, 2, 10, 0]) }],
    results: [
      {
        name: 'Result',
        data: new Uint8Array([
          58, 29, 10, 27, 10, 25, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148,
          211, 254, 19, 172, 18, 9, 67, 121, 112, 101, 114, 111, 99, 107,
        ]),
      },
    ],
    errorInstance: DeviceAppError,
  },
];

export default invalidData;
