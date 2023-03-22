import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetPublicKeyTestCase } from './types';

const commonParams = {
  params: {
    walletId: new Uint8Array([10]),
    derivationPath: [
      { path: 44, isHardened: true },
      { path: 0, isHardened: true },
      { path: 0, isHardened: true },
    ],
  },
  query: new Uint8Array([
    10, 19, 10, 17, 10, 1, 10, 18, 4, 8, 44, 16, 1, 18, 2, 16, 1, 18, 2, 16, 1,
  ]),
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_RESULT],
};

const invalidData: IGetPublicKeyTestCase[] = [
  {
    name: 'Invalid data',
    ...commonParams,
    result: new Uint8Array([
      109, 112, 102, 98, 72, 57, 117, 109, 75, 69, 83, 117, 117, 49, 103, 78,
      100, 105, 87, 83, 116, 106, 71, 54, 67, 110, 104, 77, 86, 49, 113, 97, 78,
      111, 50, 98, 118, 52, 67, 113, 72, 122, 120, 85, 98, 53, 86, 68, 115, 86,
      52, 77, 86, 112, 83, 70, 86, 78, 121, 121, 109, 83, 112, 98, 74, 76, 55,
      57, 75, 89, 86, 57, 75, 56, 88, 82, 100, 105, 98, 70, 109, 118, 54, 116,
      86, 54, 116, 50, 122, 52, 100, 87, 110, 111, 110, 78, 52, 78, 77, 89, 109,
    ]),
  },
  {
    name: 'Invalid data',
    ...commonParams,
    result: new Uint8Array([
      10, 34, 10, 3, 90, 221, 135, 18, 2, 8, 1, 24, 1, 34, 11, 8, 2, 18, 7, 8,
    ]),
  },
  {
    name: 'Invalid data',
    ...commonParams,
    result: new Uint8Array([10]),
  },
  {
    name: 'Invalid data',
    ...commonParams,
    result: new Uint8Array([]),
  },
];

export default invalidData;
