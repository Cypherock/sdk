import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IEncryptMessagesTestCase } from './types';
import { Query, Result } from '../../../src/proto/generated/inheritance/core';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
    messages: [
      { value: 'test' },
      { value: 'something else' },
      { value: 'something other than something else', isPrivate: true },
    ],
  },
  queries: [
    {
      name: 'initiate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            setup: {
              walletId: new Uint8Array([
                199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
                233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86,
                128, 26, 3, 187,
              ]),
              plainData: [
                { message: Buffer.from('test'), isPrivate: false },
                { message: Buffer.from('something else'), isPrivate: false },
                {
                  message: Buffer.from('something other than something else'),
                  isPrivate: true,
                },
              ],
            },
          }),
        ).finish(),
      ),
    },
  ],
};

const withUnknownError: IEncryptMessagesTestCase = {
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

const withInvalidAppId: IEncryptMessagesTestCase = {
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

const error: IEncryptMessagesTestCase[] = [withUnknownError, withInvalidAppId];

export default error;
