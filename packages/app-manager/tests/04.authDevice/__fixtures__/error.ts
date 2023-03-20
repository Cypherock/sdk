import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IAuthDeviceTestCase } from './types';

const withUserRejection: IAuthDeviceTestCase = {
  name: 'When user rejects the device auth',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'userRejection',
      data: new Uint8Array([26, 5, 26, 3, 176, 1, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.USER_REJECTION],
  mocks: {
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
  },
};

const error: IAuthDeviceTestCase[] = [withUserRejection];

export default error;
