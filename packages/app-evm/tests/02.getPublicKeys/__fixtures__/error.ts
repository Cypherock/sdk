import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetPublicKeysTestCase } from './types';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPaths: [
      {
        path: [
          { index: 44, isHardened: true },
          { index: 60, isHardened: true },
          { index: 0, isHardened: true },
          { index: 0, isHardened: false },
          { index: 0, isHardened: false },
        ],
      },
    ],
    chainId: 1,
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        10, 68, 10, 66, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220,
        38, 17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8,
        53, 86, 128, 26, 3, 187, 121, 64, 18, 24, 10, 4, 8, 44, 16, 1, 10, 4, 8,
        60, 16, 1, 10, 2, 16, 1, 10, 2, 16, 0, 10, 2, 16, 0, 24, 1, 32, 1,
      ]),
    },
  ],
};

const withUnknownError: IGetPublicKeysTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: new Uint8Array([10, 4, 18, 2, 8, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
};

const withInvalidAppId: IGetPublicKeysTestCase = {
  name: 'With invalid app id',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: new Uint8Array([10, 4, 18, 2, 16, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_APP_ID_ON_DEVICE],
};

const error: IGetPublicKeysTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
