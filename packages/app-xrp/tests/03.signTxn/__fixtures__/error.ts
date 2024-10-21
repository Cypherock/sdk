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
    derivationPath: [0x80000000 + 44, 0x80000000 + 144, 0x80000000, 0, 0],
    txn: {
      rawTxn: {
        TransactionType: 'Payment',
        Account: 'rQGDkQchoJxMSLZR7q9GwvY3iKtDqTUYNQ',
        Amount: '5000000',
        Destination: 'rEgfV7YeyG4YayQQufxaqDx4aUA93SidLb',
        Flags: 0,
        NetworkID: undefined,
        Sequence: 676674,
        Fee: '12',
        LastLedgerSequence: 1238396,
        SigningPubKey:
          '027497533006d024ffb612a2110eb327ccfeed2b752d787c96ab2d3cca425a40e8',
      },
      txnHex:
        '53545800120000220000000024000A5342201B0012E57C6140000000004C4B4068400000000000000C7321027497533006D024FFB612A2110EB327CCFEED2B752D787C96AB2D3CCA425A40E88114FF2BC637244009494C6203505254126638AAD7CD8314A0F766DFCC0B5DDC91E7679C7539590983A41D9F',
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
              0x80000000 + 144,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 120,
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
