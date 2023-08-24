import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ITrainJoystickTestCase } from './types';

const withInvalidResult: ITrainJoystickTestCase = {
  name: 'With invalid result',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([50, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([50, 5]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]
      .message,
};

const withUnknownError: ITrainJoystickTestCase = {
  name: 'With invalid result',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([50, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'result',
      data: new Uint8Array([50, 4, 18, 2, 8, 0]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR].message,
};

const error: ITrainJoystickTestCase[] = [withInvalidResult, withUnknownError];

export default error;
