import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IGetPublicKeyTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/btc/core';

const commonParams = {
  params: {
    walletId: new Uint8Array([10]),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 0, 0],
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            getPublicKey: {
              initiate: {
                walletId: new Uint8Array([10]),
                derivationPath: [0x8000002c, 0x80000000, 0x80000000, 0, 0],
              },
            },
          }),
        ).finish(),
      ),
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
  results: [
    {
      name: 'error',
      data: Uint8Array.from(Result.encode(Result.create({})).finish()),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE],
};

const error: IGetPublicKeyTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
