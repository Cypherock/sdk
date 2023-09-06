import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignPersonalMsgTestCase } from './types';
import { Query } from '../../../src/proto/generated/evm/core';
import { SignMsgType } from '../../../src';
import { resultToUint8Array } from '../__helpers__';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
    message:
      '0x74657374696e67207465787420666f72207369676e696e6720706572736f6e616c206d657373616765',
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            signMsg: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                derivationPath: [
                  0x80000000 + 44,
                  0x80000000 + 60,
                  0x80000000,
                  0,
                  0,
                ],
                messageType: SignMsgType.SIGN_MSG_TYPE_PERSONAL_SIGN,
                totalMsgSize: 41,
              },
            },
          }),
        ).finish(),
      ),
    },
  ],
};

const withUnknownError: ISignPersonalMsgTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: resultToUint8Array({
        signMsg: {
          commonError: {
            unknownError: 1,
          },
        },
      }),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR].message,
};

const withInvalidResult: ISignPersonalMsgTestCase = {
  name: 'With invalid result',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: new Uint8Array([26, 4, 26, 2, 24, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]
      .message,
};

const error: ISignPersonalMsgTestCase[] = [withUnknownError, withInvalidResult];

export default error;
