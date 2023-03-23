import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetXpubsTestCase } from './types';

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
          { index: 0, isHardened: true },
          { index: 0, isHardened: true },
        ],
      },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        18, 54, 10, 52, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220,
        38, 17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8,
        53, 86, 128, 26, 3, 187, 121, 64, 18, 14, 10, 4, 8, 44, 16, 1, 10, 2,
        16, 1, 10, 2, 16, 1,
      ]),
    },
  ],
};

const withUnknownError: IGetXpubsTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [{ name: 'error', data: new Uint8Array([18, 4, 18, 2, 8, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
};

const withInvalidAppId: IGetXpubsTestCase = {
  name: 'With invalid app id',
  ...commonParams,
  results: [{ name: 'error', data: new Uint8Array([18, 4, 18, 2, 16, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_APP_ID_ON_DEVICE],
};

const error: IGetXpubsTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
