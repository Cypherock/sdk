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
      { path: 44, isHardened: true },
      { path: 0, isHardened: true },
      { path: 0, isHardened: true },
    ],
  },
  query: new Uint8Array([
    10, 19, 10, 17, 10, 1, 10, 18, 4, 8, 44, 16, 1, 18, 2, 16, 1, 18, 2, 16, 1,
  ]),
};

const withUnknownError: IGetPublicKeyTestCase = {
  name: 'With unknown error',
  ...commonParams,
  result: new Uint8Array([10, 4, 18, 2, 8, 0]),
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
};

const withInvalidAppId: IGetPublicKeyTestCase = {
  name: 'With invalid app id',
  ...commonParams,
  result: new Uint8Array([10, 4, 18, 2, 16, 0]),
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_APP_ID_ON_DEVICE],
};

const error: IGetPublicKeyTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
