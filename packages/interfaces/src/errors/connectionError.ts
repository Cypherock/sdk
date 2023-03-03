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
    doRetry: boolean;
  };
};

const errorObjects: CodeToErrorMap = {
  [DeviceConnectionErrorType.NOT_CONNECTED]: {
    message: 'No device connected',
    doRetry: false,
  },
  [DeviceConnectionErrorType.DEVICE_DISCONNECTED_IN_FLOW]: {
    message: 'Device disconnected in flow',
    doRetry: false,
  },
  [DeviceConnectionErrorType.CONNECTION_CLOSED]: {
    message: 'Connection was closed while in process',
    doRetry: false,
  },
  [DeviceConnectionErrorType.CONNECTION_NOT_OPEN]: {
    message: 'Connection was not open',
    doRetry: false,
  },
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]: {
    message: 'Failed to create device connection',
    doRetry: false,
  },
};

export class DeviceConnectionError extends Error {
  public code: DeviceConnectionErrorType;

  public message: string;

  public doRetry: boolean;

  constructor(errorCode: DeviceConnectionErrorType) {
    super();
    this.code = errorCode;
    this.message = errorObjects[this.code].message;
    this.doRetry = errorObjects[this.code].doRetry;

    if ((<any>Object).setPrototypeOf) {
      (<any>Object).setPrototypeOf(this, DeviceConnectionError.prototype);
    } else {
      // eslint-disable-next-line
      (<any>this).__proto__ = DeviceConnectionError.prototype;
    }
  }
}
