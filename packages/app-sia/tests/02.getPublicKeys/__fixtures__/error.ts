import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetPublicKeysTestCase } from './types';
import { Query } from '../../../src/proto/generated/sia/core';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217, 116,
      107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58, 1, 150, 199,
    ]),
    derivationPaths: [
      {
        path: [0], // Single element for Sia
      },
    ],
  },
  queries: [
    {
      name: 'Initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKeys: {
              initiate: {
                walletId: new Uint8Array([
                  166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8,
                  217, 116, 107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199,
                  175, 58, 1, 150, 199,
                ]),
                derivationPaths: [
                  {
                    path: [0],
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

const withCorruptData: IGetPublicKeysTestCase = {
  name: 'With corrupt data error',
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

const error: IGetPublicKeysTestCase[] = [withUnknownError, withCorruptData];

export default error;
