import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ITrainCardTestCase } from './types';

const withUnknownError: ITrainCardTestCase = {
  name: 'With unknown error',
  query: new Uint8Array([58, 2, 10, 0]),
  result: new Uint8Array([58, 4, 18, 2, 8, 0]),
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
};

const withInvalidAppId: ITrainCardTestCase = {
  name: 'With msg from device',
  query: new Uint8Array([58, 2, 10, 0]),
  result: new Uint8Array([58, 4, 18, 2, 0]),
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE],
};

const error: ITrainCardTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
