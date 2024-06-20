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
    derivationPath: [0x80000000 + 44, 0x80000000 + 195, 0x80000000, 0, 0],
    txn: {
      txID: 'ae9595f76c538df617834f2a82e474ffd80ec67b378b7758856ff3730737d2ba',
      raw_data: {
        contract: [
          {
            parameter: {
              value: {
                amount: 5,
                owner_address: '41e4a7664b2dbcb2fdcc7f1e40bc17549b438aaef3',
                to_address: '41281ad562a89aa2f777ea0c688ceda306e5ec9874',
              },
              type_url: 'type.googleapis.com/protocol.TransferContract',
            },
            type: 'TransferContract',
          },
        ],
        ref_block_bytes: '6545',
        ref_block_hash: '9c1b7e8ed8f70f73',
        expiration: 1718876028000,
        timestamp: 1718875970281,
      },
      raw_data_hex:
        '0a02654522089c1b7e8ed8f70f7340e0f8faa783325a65080112610a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412300a1541e4a7664b2dbcb2fdcc7f1e40bc17549b438aaef3121541281ad562a89aa2f777ea0c688ceda306e5ec9874180570e9b5f7a78332',
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
              0x80000000 + 195,
              0x80000000,
              0,
              0,
            ],
            transactionSize: 131,
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
