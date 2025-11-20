import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array } from '../__helpers__';
import { ISignTxnParams } from '../../../src';

const sampleSiaTransactionBlob =
  '0100000000000000b4e06bc83993cb0b99d7f63b91e3736df3400f0952f77ed527d020ad997d48f40200000000000000e62a389672890ed147593075ebe21385dd1a813209dec2c7375b38c9da342f420000f0e61aa34caa8f45080000000000a884c91fffb35194cccb77aa371315801f4120f3fba6f20a4bca0c53754940aa008065f4245606983449e300000000000000d01309468e150100000000000000';

const commonParams: {
  params: ISignTxnParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  errorInstance?: any;
  [key: string]: any;
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
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]
      .message,
};

const invalidData: ISignTxnTestCase[] = [
  {
    name: 'Invalid protobuf data',
    ...commonParams,
    results: [
      {
        name: 'error',
        data: new Uint8Array([
          109, 112, 102, 98, 72, 57, 117, 109, 75, 69, 83, 117, 117, 49, 103,
          78, 100, 105, 87, 83, 116, 106, 71, 54, 67, 110, 104, 77, 86, 49, 113,
          97, 78, 111, 50, 98, 118, 52, 67, 113, 72, 122, 120, 85, 98, 53, 86,
          68, 115, 86, 52, 77, 86, 112, 83, 70, 86, 78, 121, 121, 109, 83, 112,
          98, 74, 76, 55, 57, 75, 89, 86, 57, 75, 56, 88, 82, 100, 105, 98, 70,
          109, 118, 54, 116, 86, 54, 116, 50, 122, 52, 100, 87, 110, 111, 110,
          78, 52, 78, 77, 89, 109,
        ]),
      },
    ],
  },
  {
    name: 'Truncated protobuf data',
    ...commonParams,
    results: [
      {
        name: 'error',
        data: new Uint8Array([
          10, 34, 10, 3, 90, 221, 135, 18, 2, 8, 1, 24, 1, 34, 11, 8, 2, 18, 7,
          8,
        ]),
      },
    ],
  },
  {
    name: 'Incomplete protobuf message',
    ...commonParams,
    results: [
      {
        name: 'error',
        data: new Uint8Array([10]),
      },
    ],
  },
  {
    name: 'Empty response data',
    ...commonParams,
    results: [
      {
        name: 'error',
        data: new Uint8Array([]),
      },
    ],
  },
];

export default invalidData;
