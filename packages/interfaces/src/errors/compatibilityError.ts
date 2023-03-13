export enum DeviceCompatibilityErrorType {
  INVALID_SDK_OPERATION = 'COM_0200',
}

type CodeToErrorMap = {
  [property in DeviceCompatibilityErrorType]: {
    message: string;
    doRetry: boolean;
  };
};

export const deviceCompatibilityErrorTypeDetails: CodeToErrorMap = {
  [DeviceCompatibilityErrorType.INVALID_SDK_OPERATION]: {
    message: 'The device sdk does not support this function',
    doRetry: false,
  },
};

export class DeviceCompatibilityError extends Error {
  public code: DeviceCompatibilityErrorType;

  public message: string;

  public doRetry: boolean;

  constructor(errorCode: DeviceCompatibilityErrorType) {
    super();
    this.code = errorCode;
    this.message = deviceCompatibilityErrorTypeDetails[this.code].message;
    this.doRetry = deviceCompatibilityErrorTypeDetails[this.code].doRetry;

    if ((<any>Object).setPrototypeOf) {
      (<any>Object).setPrototypeOf(this, DeviceCompatibilityError.prototype);
    } else {
      // eslint-disable-next-line
      (<any>this).__proto__ = DeviceCompatibilityError.prototype;
    }
  }
}
