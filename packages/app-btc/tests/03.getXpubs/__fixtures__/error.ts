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
        path: [0x80000000 + 44, 0x80000000, 0x80000000],
      },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        18, 57, 10, 55, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220,
        38, 17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8,
        53, 86, 128, 26, 3, 187, 121, 64, 18, 17, 10, 15, 172, 128, 128, 128, 8,
        128, 128, 128, 128, 8, 128, 128, 128, 128, 8,
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
  name: 'With invalid msg from device',
  ...commonParams,
  results: [{ name: 'error', data: new Uint8Array([18, 4, 18, 2, 16, 0]) }],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.CORRUPT_DATA],
};

const error: IGetXpubsTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
