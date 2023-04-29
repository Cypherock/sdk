import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IAuthCardTestCase } from './types';

const withUserRejection: IAuthCardTestCase = {
  name: 'When user rejects the card auth',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'userRejection',
      data: new Uint8Array([34, 5, 26, 3, 176, 1, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.USER_REJECTION],
};

const withCardError: IAuthCardTestCase = {
  name: 'When card error',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'userRejection',
      data: new Uint8Array([34, 5, 26, 3, 168, 1, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.CARD_OPERATION_FAILED],
};

const error: IAuthCardTestCase[] = [withUserRejection, withCardError];

export default error;
