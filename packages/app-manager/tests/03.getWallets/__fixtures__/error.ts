import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetWalletsTestCase } from './types';

const withUnknownError: IGetWalletsTestCase = {
  name: 'With unknown error',
  query: new Uint8Array([18, 2, 10, 0]),
  result: new Uint8Array([18, 4, 18, 2, 8, 0]),
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR].message,
};

const withInvalidAppId: IGetWalletsTestCase = {
  name: 'With corrupt msg from device',
  query: new Uint8Array([18, 2, 10, 0]),
  result: new Uint8Array([18, 4, 18, 2, 16, 0]),
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.CORRUPT_DATA].message,
};

const error: IGetWalletsTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
