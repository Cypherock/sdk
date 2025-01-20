import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

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
