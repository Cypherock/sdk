import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetDeviceInfoTestCase } from './types';

const withUnknownError: IGetDeviceInfoTestCase = {
  name: 'With unknown error',
  query: new Uint8Array([10, 2, 10, 0]),
  result: new Uint8Array([10, 4, 18, 2, 8, 0]),
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
};

const withInvalidAppId: IGetDeviceInfoTestCase = {
  name: 'With msg from device',
  query: new Uint8Array([10, 2, 10, 0]),
  result: new Uint8Array([10, 4, 18, 2, 16, 0]),
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE],
};

const error: IGetDeviceInfoTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
