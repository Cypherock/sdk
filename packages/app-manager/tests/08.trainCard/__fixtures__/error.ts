import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ITrainCardTestCase } from './types';

const withUnknownError: ITrainCardTestCase = {
  name: 'With unknown error',
  queries: [{ name: 'Initiate', data: new Uint8Array([58, 2, 10, 0]) }],
  results: [{ name: 'Result', data: new Uint8Array([58, 4, 18, 2, 8, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]
      .message,
};

const withInvalidAppId: ITrainCardTestCase = {
  name: 'With invalid msg from device',
  queries: [{ name: 'Initiate', data: new Uint8Array([58, 2, 10, 0]) }],
  results: [{ name: 'Result', data: new Uint8Array([58, 4, 18, 2, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]
      .message,
};

const error: ITrainCardTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
