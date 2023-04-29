import { DeviceError } from './deviceError';

export enum DeviceCompatibilityErrorType {
  INVALID_SDK_OPERATION = 'COM_0200',
  DEVICE_NOT_SUPPORTED = 'COM_0201',
}

type CodeToErrorMap = {
  [property in DeviceCompatibilityErrorType]: {
    message: string;
  };
};

export const deviceCompatibilityErrorTypeDetails: CodeToErrorMap = {
  [DeviceCompatibilityErrorType.INVALID_SDK_OPERATION]: {
    message: 'The device sdk does not support this function',
  },
  [DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED]: {
    message: 'The connected device is not supported by this SDK',
  },
};

export class DeviceCompatibilityError extends DeviceError {
  constructor(errorCode: DeviceCompatibilityErrorType) {
    super(
      errorCode,
      deviceCompatibilityErrorTypeDetails[errorCode].message,
      DeviceCompatibilityError,
    );
  }
}
