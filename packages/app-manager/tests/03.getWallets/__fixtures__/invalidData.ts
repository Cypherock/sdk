import { DeviceAppError } from '@cypherock/sdk-interfaces';
import { IGetWalletsTestCase } from './types';

const invalidData: IGetWalletsTestCase[] = [
  {
    name: 'Invalid data',
    query: new Uint8Array([18, 2, 10, 0]),
    result: new Uint8Array([
      18, 29, 34, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211, 254,
    ]),
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    query: new Uint8Array([18, 2, 10, 0]),
    result: new Uint8Array([
      18, 29, 34, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211, 254,
      190, 172, 18, 9, 67, 121, 112, 104, 101, 114, 111, 99, 107, 24,
    ]),
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    query: new Uint8Array([18, 2, 10, 0]),
    result: new Uint8Array([18]),
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    query: new Uint8Array([18, 2, 10, 0]),
    result: new Uint8Array([]),
    errorInstance: DeviceAppError,
  },
  {
    name: 'Invalid data',
    query: new Uint8Array([18, 2, 10, 0]),
    result: new Uint8Array([
      10, 30, 10, 12, 123, 43, 26, 231, 42, 86, 91, 130, 41, 55, 186, 203, 18,
      2, 8, 1, 24, 1, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26,
    ]),
    errorInstance: DeviceAppError,
  },
];

export default invalidData;
