import { DeviceAppError } from '@cypherock/sdk-interfaces';
import { IGetDeviceInfoTestCase } from './types';

const invalidData: IGetDeviceInfoTestCase[] = [
  {
    name: 'Invalid data',
    query: new Uint8Array([10, 2, 10, 0]),
    result: new Uint8Array([2, 8, 1, 24, 1, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26]),
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    query: new Uint8Array([10, 2, 10, 0]),
    result: new Uint8Array([
      10, 34, 10, 3, 90, 221, 135, 18, 2, 8, 1, 24, 1, 34, 11, 8, 2, 18, 7, 8,
    ]),
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    query: new Uint8Array([10, 2, 10, 0]),
    result: new Uint8Array([10]),
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    query: new Uint8Array([10, 2, 10, 0]),
    result: new Uint8Array([]),
    errorInstance: DeviceAppError,
  },
];

export default invalidData;
