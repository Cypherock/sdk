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
      { index: 44, isHardened: true },
      { index: 0, isHardened: true },
      { index: 0, isHardened: true },
      { index: 0, isHardened: false },
      { index: 0, isHardened: false },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        10, 27, 10, 25, 10, 1, 10, 18, 4, 8, 44, 16, 1, 18, 2, 16, 1, 18, 2, 16,
        1, 18, 2, 16, 0, 18, 2, 16, 0,
      ]),
    },
  ],
};

const withUnknownError: IGetPublicKeyTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [{ name: 'error', data: new Uint8Array([10, 4, 18, 2, 8, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
};

const withInvalidAppId: IGetPublicKeyTestCase = {
  name: 'With invalid app id',
  ...commonParams,
  results: [{ name: 'error', data: new Uint8Array([10, 4, 18, 2, 16, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_APP_ID_ON_DEVICE],
};

const error: IGetPublicKeyTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
