import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';
import { ISignTxnParams } from '../../../src';

const commonParams: {
  params: ISignTxnParams;
  queries: {
    name: string;
    data: Uint8Array;
  }[];
} = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [0x80000000 + 44, 0x80000000 + 223, 0x80000000, 0, 0],
    txn: {
      icpTransferReq: {
        requestType: new TextEncoder().encode('call'),
        canisterId: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 2, 1, 1]),
        methodName: new TextEncoder().encode('transfer'),
        arg: Uint8Array.from([
          68, 73, 68, 76, 3, 109, 123, 108, 1, 224, 169, 179, 2, 120, 108, 4,
          251, 202, 1, 0, 198, 252, 182, 2, 1, 186, 137, 229, 194, 4, 120, 216,
          163, 140, 168, 13, 1, 1, 2, 32, 54, 198, 80, 60, 173, 178, 189, 85,
          215, 146, 209, 219, 105, 70, 179, 185, 55, 40, 181, 214, 217, 126,
          160, 207, 98, 9, 199, 79, 238, 61, 108, 28, 16, 39, 0, 0, 0, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 0, 160, 134, 1, 0, 0, 0, 0, 0,
        ]),
        sender: Uint8Array.from([
          227, 137, 21, 196, 210, 48, 9, 104, 105, 112, 145, 141, 222, 4, 35,
          30, 243, 77, 211, 3, 202, 109, 129, 195, 8, 221, 52, 126, 2,
        ]),
        ingressExpiry: Uint8Array.from([
          0x80, 0x80, 0xe2, 0x83, 0x9c, 0x94, 0x9a, 0x92, 0x18,
        ]),
        nonce: Uint8Array.from([
          0xd3, 0x86, 0xb7, 0xab, 0x9b, 0x5e, 0x1c, 0x0f, 0x81, 0x66, 0xdc,
          0x17, 0xf9, 0x63, 0x58, 0x02,
        ]),
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
              0x80000000 + 44,
              0x80000000 + 223,
              0x80000000,
              0,
              0,
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
