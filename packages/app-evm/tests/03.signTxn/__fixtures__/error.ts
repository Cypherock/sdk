import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { ISignTxnTestCase } from './types';

const commonParams = {
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [
      { index: 44, isHardened: true },
      { index: 60, isHardened: true },
      { index: 0, isHardened: true },
      { index: 0, isHardened: false },
      { index: 0, isHardened: false },
    ],
    txn: '0xed8205a385059aaf0d8082520894292f04a44506c2fd49bac032e1ca148c35a478c887c962225a2ab40080018080',
  },
  queries: [
    {
      name: 'Initate query',
      data: new Uint8Array([
        18, 65, 10, 63, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220,
        38, 17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8,
        53, 86, 128, 26, 3, 187, 121, 64, 18, 4, 8, 44, 16, 1, 18, 4, 8, 60, 16,
        1, 18, 2, 16, 1, 18, 2, 16, 0, 18, 2, 16, 0, 26, 1, 1,
      ]),
    },
  ],
};

const withUnknownError: ISignTxnTestCase = {
  name: 'With unknown error',
  ...commonParams,
  results: [
    {
      name: 'error',
      data: new Uint8Array([18, 4, 26, 2, 8, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage: deviceAppErrorTypeDetails[DeviceAppErrorType.UNKNOWN_ERROR],
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
    deviceAppErrorTypeDetails[DeviceAppErrorType.INVALID_RESULT_ON_DEVICE],
};

const error: ISignTxnTestCase[] = [withUnknownError, withInvalidResult];

export default error;
