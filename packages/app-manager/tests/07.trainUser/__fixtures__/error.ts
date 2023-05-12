import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ITrainUserTestCase } from './types';

const withInvalidResult: ITrainUserTestCase = {
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
      data: new Uint8Array([50, 4, 18, 2, 24, 0]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE],
};

const withUnknownError: ITrainUserTestCase = {
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
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
};

const error: ITrainUserTestCase[] = [withInvalidResult, withUnknownError];

export default error;
