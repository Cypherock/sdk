import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetPublicKeyTestCase } from './types';

const commonParams = {
  params: {
    walletId: new Uint8Array([10]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 0, 0],
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        10, 24, 10, 22, 10, 1, 10, 18, 17, 172, 128, 128, 128, 8, 128, 128, 128,
        128, 8, 128, 128, 128, 128, 8, 0, 0,
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
  name: 'With invalid msg from device',
  ...commonParams,
  results: [{ name: 'error', data: new Uint8Array([10, 4, 18, 2, 16, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.CORRUPT_DATA],
};

const error: IGetPublicKeyTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
