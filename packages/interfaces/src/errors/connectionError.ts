import { DeviceError } from './deviceError';

export enum DeviceConnectionErrorType {
  NOT_CONNECTED = 'CON_0100',
  CONNECTION_CLOSED = 'CON_0101',
  FAILED_TO_CONNECT = 'CON_0102',
}

type CodeToErrorMap = {
  [property in DeviceConnectionErrorType]: {
    message: string;
  };
};

export const deviceConnectionErrorTypeDetails: CodeToErrorMap = {
  [DeviceConnectionErrorType.NOT_CONNECTED]: {
    message: 'No device connected',
  },
  [DeviceConnectionErrorType.CONNECTION_CLOSED]: {
    message: 'Connection was closed while in process',
  },
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]: {
    message: 'Failed to create device connection',
  },
};

export class DeviceConnectionError extends DeviceError {
  constructor(errorCode: DeviceConnectionErrorType) {
    super(
      errorCode,
      deviceConnectionErrorTypeDetails[errorCode].message,
      DeviceConnectionError,
    );
  }
}
