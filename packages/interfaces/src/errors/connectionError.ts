import { DeviceError } from './deviceError';

export enum DeviceConnectionErrorType {
  NOT_CONNECTED = 'CON_0100',
  DEVICE_DISCONNECTED_IN_FLOW = 'CON_0101',
  CONNECTION_CLOSED = 'CON_0102',
  CONNECTION_NOT_OPEN = 'CON_0103',
  FAILED_TO_CONNECT = 'CON_0104',
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
  [DeviceConnectionErrorType.DEVICE_DISCONNECTED_IN_FLOW]: {
    message: 'Device disconnected in flow',
  },
  [DeviceConnectionErrorType.CONNECTION_CLOSED]: {
    message: 'Connection was closed while in process',
  },
  [DeviceConnectionErrorType.CONNECTION_NOT_OPEN]: {
    message: 'Connection was not open',
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
