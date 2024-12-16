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
    derivationPath: [
      0x80000000 + 0xa55,
      0x80000000 + 0x4741e9c9,
      0x80000000 + 0x447a6028,
      0x80000000,
      0x80000000,
      0xc,
    ],
    txn: {
      invokeTxn: {
        senderAddress: new Uint8Array([
          199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233,
          62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3,
          187, 121, 64,
        ]),
        version: new Uint8Array([0x0]),
        calldata: { value: [new Uint8Array([0x0])] },
        chainId: new Uint8Array([0x0]),
        nonce: new Uint8Array([0x20]),
        accountDeploymentData: [new Uint8Array([0x0])],
        nonceDataAvailabilityMode: new Uint8Array([0x0]),
        feeDataAvailabilityMode: new Uint8Array([0x0]),
        resourceBound: {
          level1: {
            maxAmount: new Uint8Array([0x0]),
            maxPricePerUnit: new Uint8Array([0x0]),
          },
          level2: {
            maxAmount: new Uint8Array([0x0]),
            maxPricePerUnit: new Uint8Array([0x0]),
          },
        },
        tip: new Uint8Array([0x0]),
        paymasterData: [new Uint8Array([0x0])],
      },
    },
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
              0x80000000 + 0xa55,
              0x80000000 + 0x4741e9c9,
              0x80000000 + 0x447a6028,
              0x80000000,
              0x80000000,
              0xc,
            ],
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
