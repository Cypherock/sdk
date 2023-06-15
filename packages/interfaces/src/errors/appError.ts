import { DeviceError } from './deviceError';

export enum DeviceAppErrorType {
  UNKNOWN_ERROR = 'APP_0000',

  NO_WORKING_PACKET_VERSION = 'APP_0100',
  EXECUTING_OTHER_COMMAND = 'APP_0101',
  PROCESS_ABORTED = 'APP_0102',
  DEVICE_ABORT = 'APP_0103',

  INVALID_MSG_FROM_DEVICE = 'APP_0200',
  INVALID_APP_ID_FROM_DEVICE = 'APP_0201',

  INVALID_MSG = 'APP_0202',
  UNKNOWN_APP = 'APP_0203',
  APP_NOT_ACTIVE = 'APP_0204',

  DEVICE_SETUP_REQUIRED = 'APP_0205',

  WALLET_NOT_FOUND = 'APP_0300',
  WALLET_PARTIAL_STATE = 'APP_0301',
  NO_WALLET_EXISTS = 'APP_0302',

  CARD_OPERATION_FAILED = 'APP_0400',

  USER_REJECTION = 'APP_0501',

  CORRUPT_DATA = 'TODO_CORRUPT_DATA_ERROR', // TODO: add corrupt data error
}

type CodeToErrorMap = {
  [property in DeviceAppErrorType]: {
    message: string;
  };
};

export const deviceAppErrorTypeDetails: CodeToErrorMap = {
  [DeviceAppErrorType.UNKNOWN_ERROR]: {
    message: 'Unknown application error',
  },
  [DeviceAppErrorType.NO_WORKING_PACKET_VERSION]: {
    message: 'No working packet version found',
  },
  [DeviceAppErrorType.EXECUTING_OTHER_COMMAND]: {
    message: 'The device is executing some other command',
  },
  [DeviceAppErrorType.PROCESS_ABORTED]: {
    message: 'The process was aborted',
  },
  [DeviceAppErrorType.DEVICE_ABORT]: {
    message: 'The request was timed out on the device',
  },

  [DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]: {
    message: 'Invalid result received from device',
  },
  [DeviceAppErrorType.INVALID_APP_ID_FROM_DEVICE]: {
    message: 'Invalid appId received from device',
  },
  [DeviceAppErrorType.INVALID_MSG]: {
    message: 'Invalid result sent from app',
  },
  [DeviceAppErrorType.UNKNOWN_APP]: {
    message: 'The app does not exist on device',
  },
  [DeviceAppErrorType.APP_NOT_ACTIVE]: {
    message: 'The app is active on the device',
  },
  [DeviceAppErrorType.DEVICE_SETUP_REQUIRED]: {
    message: 'Device setup is required',
  },

  [DeviceAppErrorType.WALLET_NOT_FOUND]: {
    message: 'Selected wallet is not present on the device',
  },
  [DeviceAppErrorType.WALLET_PARTIAL_STATE]: {
    message: 'Selected wallet is in partial state',
  },
  [DeviceAppErrorType.NO_WALLET_EXISTS]: {
    message: 'No wallet exists on the device',
  },
  [DeviceAppErrorType.CARD_OPERATION_FAILED]: {
    message: 'Card operation failed',
  },
  [DeviceAppErrorType.USER_REJECTION]: {
    message: 'User rejected the operation',
  },
  [DeviceAppErrorType.CORRUPT_DATA]: {
    message: 'Corrupted data received', // TODO: check corrupt message error
  },
};

export class DeviceAppError extends DeviceError {
  constructor(errorCode: DeviceAppErrorType) {
    super(
      errorCode,
      deviceAppErrorTypeDetails[errorCode].message,
      DeviceAppError,
    );
  }
}
