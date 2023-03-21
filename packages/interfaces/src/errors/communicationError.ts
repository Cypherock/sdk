import { DeviceError } from './deviceError';

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
  };
};

export const deviceCommunicationErrorTypeDetails: CodeToErrorMap = {
  [DeviceCommunicationErrorType.IN_BOOTLOADER]: {
    message: 'Device is in bootloader mode',
  },
  [DeviceCommunicationErrorType.WRITE_REJECTED]: {
    message: 'The write packet operation was rejected by the device',
  },
  [DeviceCommunicationErrorType.WRITE_ERROR]: {
    message: 'Unable to write packet to the device',
  },

  [DeviceCommunicationErrorType.TIMEOUT_ERROR]: {
    message: 'Timeout Error due to write/read',
  },
  [DeviceCommunicationErrorType.WRITE_TIMEOUT]: {
    message: 'Did not receive ACK of sent packet on time',
  },
  [DeviceCommunicationErrorType.READ_TIMEOUT]: {
    message: 'Did not receive the expected data from device on time',
  },
  [DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR]: {
    message: 'Unknown Error at communication module',
  },
};

export class DeviceCommunicationError extends DeviceError {
  constructor(errorCode: DeviceCommunicationErrorType) {
    super(
      errorCode,
      deviceCommunicationErrorTypeDetails[errorCode].message,
      DeviceCommunicationError,
    );
  }
}
