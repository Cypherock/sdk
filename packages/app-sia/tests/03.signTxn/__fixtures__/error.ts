import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';
import { ISignTxnParams } from '../../../src';

const sampleSiaTransactionBlob =
  '0100000000000000b4e06bc83993cb0b99d7f63b91e3736df3400f0952f77ed527d020ad997d48f40200000000000000e62a389672890ed147593075ebe21385dd1a813209dec2c7375b38c9da342f420000f0e61aa34caa8f45080000000000a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa008065f4245606983449e300000000000000d01309468e150100000000000000';

const commonParams: {
  params: ISignTxnParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
} = {
  params: {
    walletId: new Uint8Array([
      166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217, 116,
      107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58, 1, 150, 199,
    ]),
    derivationPath: [0], // Single element for Sia
    txn: {
      blob: sampleSiaTransactionBlob,
    },
  },
  queries: [
    {
      name: 'Initiate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              166, 30, 137, 229, 122, 74, 9, 201, 225, 16, 102, 63, 162, 8, 217,
              116, 107, 202, 143, 146, 81, 40, 206, 204, 243, 123, 199, 175, 58,
              1, 150, 199,
            ]),
            derivationPath: [0],
            transactionSize: Buffer.from(sampleSiaTransactionBlob, 'hex')
              .length,
          },
        },
      }),
    },
  ],
};

const withUnknownError: ISignTxnTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: resultToUint8Array({
        signTxn: {
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

const withInvalidResult: ISignTxnTestCase = {
  name: 'With invalid result',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: new Uint8Array([18, 4, 26, 2, 24, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]
      .message,
};

const error: ISignTxnTestCase[] = [withUnknownError, withInvalidResult];

export default error;
