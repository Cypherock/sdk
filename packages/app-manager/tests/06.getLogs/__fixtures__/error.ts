import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import {
  GetLogsError,
  GetLogsErrorType,
  getLogsErrorTypeDetails,
} from '../../../src';
import { IGetLogsTestCase } from './types';

const withUserRejection: IGetLogsTestCase = {
  name: 'When user rejects the operation',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([42, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'userRejection',
      data: new Uint8Array([42, 5, 18, 3, 176, 1, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.USER_REJECTION].message,
};

const withLogsDisabled: IGetLogsTestCase = {
  name: 'When logs are disabled',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'logs disabled',
      data: new Uint8Array([42, 4, 26, 2, 8, 1]),
    },
  ],
  errorInstance: GetLogsError,
  errorMessage: getLogsErrorTypeDetails[GetLogsErrorType.LOGS_DISABLED].message,
};

const error: IGetLogsTestCase[] = [withUserRejection, withLogsDisabled];

export default error;
