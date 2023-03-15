export enum DeviceCommunicationErrorType {
  IN_BOOTLOADER = 'COM_0000',

  UNKNOWN_COMMUNICATION_ERROR = 'COM_0100',
  WRITE_ERROR = 'COM_0101',
  TIMEOUT_ERROR = 'COM_0102',
  WRITE_TIMEOUT = 'COM_0103',
  READ_TIMEOUT = 'COM_0104',
  WRITE_REJECTED = 'COM_0105',
}

type CodeToErrorMap = {
  [property in DeviceCommunicationErrorType]: {
    message: string;
    doRetry: boolean;
  };
};

export const deviceCommunicationErrorTypeDetails: CodeToErrorMap = {
  [DeviceCommunicationErrorType.IN_BOOTLOADER]: {
    message: 'Device is in bootloader mode',
    doRetry: false,
  },
  [DeviceCommunicationErrorType.WRITE_REJECTED]: {
    message: 'The write packet operation was rejected by the device',
    doRetry: false,
  },
  [DeviceCommunicationErrorType.WRITE_ERROR]: {
    message: 'Unable to write packet to the device',
    doRetry: true,
  },

  [DeviceCommunicationErrorType.TIMEOUT_ERROR]: {
    message: 'Timeout Error due to write/read',
    doRetry: true,
  },
  [DeviceCommunicationErrorType.WRITE_TIMEOUT]: {
    message: 'Did not receive ACK of sent packet on time',
    doRetry: true,
  },
  [DeviceCommunicationErrorType.READ_TIMEOUT]: {
    message: 'Did not receive the expected data from device on time',
    doRetry: true,
  },
  [DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR]: {
    message: 'Unknown Error at communication module',
    doRetry: true,
  },
};

export class DeviceCommunicationError extends Error {
  public code: DeviceCommunicationErrorType;

  public message: string;

  public doRetry: boolean;

  constructor(errorCode: DeviceCommunicationErrorType) {
    super();
    this.code =
      errorCode || DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR;
    this.message = deviceCommunicationErrorTypeDetails[this.code].message;
    this.doRetry = deviceCommunicationErrorTypeDetails[this.code].doRetry;

    if ((<any>Object).setPrototypeOf) {
      (<any>Object).setPrototypeOf(this, DeviceCommunicationError.prototype);
    } else {
      // eslint-disable-next-line
      (<any>this).__proto__ = DeviceCommunicationError.prototype;
    }
  }
}
