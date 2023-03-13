export enum DeviceAppErrorType {
  NO_WORKING_PACKET_VERSION = 'APP_0100',
  EXECUTING_OTHER_COMMAND = 'APP_0101',
  PROCESS_ABORTED = 'APP_0102',
  DEVICE_ABORT = 'APP_0103',

  INVALID_RESULT = 'APP_0200',
  INVALID_APP_ID = 'APP_0201',

  WALLET_NOT_FOUND = 'APP_0300',
  WALLET_PARTIAL_STATE = 'APP_0301',
  NO_WALLET_EXISTS = 'APP_0302',

  CARD_OPERATION_FAILED = 'APP_0400',
  CARD_NOT_PAIRED = 'APP_0401',

  USER_REJECTION = 'APP_0501',
}

type CodeToErrorMap = {
  [property in DeviceAppErrorType]: {
    message: string;
    doRetry: boolean;
  };
};

const deviceAppErrorTypeDetails: CodeToErrorMap = {
  [DeviceAppErrorType.NO_WORKING_PACKET_VERSION]: {
    message: 'No working packet version found',
    doRetry: false,
  },
  [DeviceAppErrorType.EXECUTING_OTHER_COMMAND]: {
    message: 'The device is executing some other command',
    doRetry: false,
  },
  [DeviceAppErrorType.PROCESS_ABORTED]: {
    message: 'The process was aborted',
    doRetry: false,
  },
  [DeviceAppErrorType.DEVICE_ABORT]: {
    message: 'The request was timed out on the device',
    doRetry: true,
  },

  [DeviceAppErrorType.INVALID_RESULT]: {
    message: 'Invalid result received from device',
    doRetry: false,
  },
  [DeviceAppErrorType.INVALID_APP_ID]: {
    message: 'Invalid appId received from device',
    doRetry: false,
  },

  [DeviceAppErrorType.WALLET_NOT_FOUND]: {
    message: 'Selected wallet is not present on the device',
    doRetry: false,
  },
  [DeviceAppErrorType.WALLET_PARTIAL_STATE]: {
    message: 'Selected wallet is in partial state',
    doRetry: false,
  },
  [DeviceAppErrorType.NO_WALLET_EXISTS]: {
    message: 'No wallet exists on the device',
    doRetry: false,
  },
  [DeviceAppErrorType.CARD_OPERATION_FAILED]: {
    message: 'Card operation failed',
    doRetry: false,
  },
  [DeviceAppErrorType.CARD_NOT_PAIRED]: {
    message: 'Card is not paired',
    doRetry: false,
  },
  [DeviceAppErrorType.USER_REJECTION]: {
    message: 'User rejected the operation',
    doRetry: false,
  },
};

export class DeviceAppError extends Error {
  public code: DeviceAppErrorType;

  public message: string;

  public doRetry: boolean;

  constructor(errorCode: DeviceAppErrorType) {
    super();
    this.code = errorCode;
    this.message = deviceAppErrorTypeDetails[this.code].message;
    this.doRetry = deviceAppErrorTypeDetails[this.code].doRetry;

    if ((<any>Object).setPrototypeOf) {
      (<any>Object).setPrototypeOf(this, DeviceAppError.prototype);
    } else {
      // eslint-disable-next-line
      (<any>this).__proto__ = DeviceAppError.prototype;
    }
  }
}
