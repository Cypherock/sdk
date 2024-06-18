import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array } from '../__helpers__';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
    txn: '0a027e4222084fec2812035213f34098a5ce9081325a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a1541f91fe3897cb65ba46ca0b88763fe5d0735e897f9121541d0f413cc7632d9a86599b5ccf8da0a162fa19f1d18defde43670b89aee8a8132',
  },
  queries: [
    {
      name: 'Initate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
              233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128,
              26, 3, 187, 121, 64,
            ]),
            derivationPath: [
              0x80000000 + 44,
              0x80000000 + 195,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 134,
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
    name: 'Invalid data',
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
    name: 'Invalid data',
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
    name: 'Invalid data',
    ...commonParams,

    results: [
      {
        name: 'error',
        data: new Uint8Array([10]),
      },
    ],
  },
  {
    name: 'Invalid data',
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
