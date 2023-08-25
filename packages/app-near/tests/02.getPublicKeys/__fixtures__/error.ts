import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetPublicKeysTestCase } from './types';
import { Query } from '../../../src/proto/generated/near/core';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPaths: [
      {
        path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
      },
    ],
    chainId: 1,
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKeys: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPaths: [
                  {
                    path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
                  },
                ],
              },
            },
          }),
        ).finish(),
      ),
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
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR].message,
};

const withInvalidAppId: IGetPublicKeysTestCase = {
  name: 'With invalid msg from device',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: new Uint8Array([10, 4, 18, 2, 16, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.CORRUPT_DATA].message,
};

const error: IGetPublicKeysTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
