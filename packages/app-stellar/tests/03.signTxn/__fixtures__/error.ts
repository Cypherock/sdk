import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';
import { ISignTxnParams } from '../../../src';

const sampleStellarXDR =
  'AAAAAgAAAABt7324zmZ7Qs3TJ9Ug7QWX8Qx3vx5ld9CZ8t6KGVNa8AAAA+gAAAFmAAAAAQAAAAEAAAAAAAAAAAAAAABk4LTWAAAAAAAAAAEAAAAAAAAADgAAAAFYTEGQQ5QAA+gAAAFmAAAAAAAAAAEAAAAAAAAAAQAAAABt7324zmZ7Qs3TJ9Ug7QWX8Qx3vx5ld9CZ8t6KGVNa8AAAAAAAAAAAAmJaAAAAAAAAAFEAAAAAAA==';

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
    derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED: 3 elements for Stellar
    txn: {
      xdr: sampleStellarXDR,
      networkPassphrase: 'Test SDF Network ; September 2015',
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
            derivationPath: [0x80000000 + 44, 0x80000000 + 148, 0x80000000 + 0], // CORRECTED
            transactionSize: Buffer.from(sampleStellarXDR, 'base64').length,
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
