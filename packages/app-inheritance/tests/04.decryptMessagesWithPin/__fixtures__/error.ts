import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IDecryptMessagesTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/inheritance/core';

const commonParams = {
  params: {
    encryptedData: new Uint8Array([0]),
  },
  queries: [
    {
      name: 'initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            recovery: {
              encryptedData: {
                packet: new Uint8Array([0]),
              },
            },
          }),
        ).finish(),
      ),
    },
  ],
};

const withUnknownError: IDecryptMessagesTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: Result.encode(
        Result.create({
          commonError: {
            unknownError: 1,
          },
        }),
      ).finish(),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR].message,
};

const withInvalidAppId: IDecryptMessagesTestCase = {
  name: 'With invalid msg from device',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: Result.encode(
        Result.create({
          commonError: {
            corruptData: 1,
          },
        }),
      ).finish(),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.CORRUPT_DATA].message,
};

const error: IDecryptMessagesTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
