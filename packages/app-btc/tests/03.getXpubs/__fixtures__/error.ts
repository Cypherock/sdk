import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetXpubsTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/btc/core';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPaths: [
      {
        path: [0x8000002c, 0x80000000, 0x80000000],
      },
    ],
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getXpubs: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPaths: [
                  {
                    path: [0x8000002c, 0x80000000, 0x80000000],
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

const withUnknownError: IGetXpubsTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            commonError: {
              unknownError: 1,
            },
          }),
        ).finish(),
      ),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR].message,
};

const withInvalidAppId: IGetXpubsTestCase = {
  name: 'With invalid msg from device',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: Uint8Array.from(Result.encode(Result.create({})).finish()),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]
      .message,
};

const error: IGetXpubsTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
