export enum DeviceBootloaderErrorType {
  FIRMWARE_SIZE_LIMIT_EXCEEDED = 'BTL_0100',
  WRONG_HARDWARE_VERSION = 'BTL_0101',
  WRONG_MAGIC_NUMBER = 'BTL_0102',
  SIGNATURE_NOT_VERIFIED = 'BTL_0103',
  LOWER_FIRMWARE_VERSION = 'BTL_0104',
  NOT_IN_RECEIVING_MODE = 'BTL_0105',
  FLASH_WRITE_ERROR = 'BTL_0106',
  FLASH_CRC_MISMATCH = 'BTL_0107',
  FLASH_TIMEOUT_ERROR = 'BTL_0108',
  FLASH_NACK = 'BTL_0109',
}

type CodeToErrorMap = {
  [property in DeviceBootloaderErrorType]: {
    message: string;
    doRetry: boolean;
  };
};

const errorObjects: CodeToErrorMap = {
  [DeviceBootloaderErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED]: {
    message: 'Firmware Size Limit Exceed',
    doRetry: false,
  },
  [DeviceBootloaderErrorType.WRONG_HARDWARE_VERSION]: {
    message: 'Wrong Hardware version',
    doRetry: false,
  },
  [DeviceBootloaderErrorType.WRONG_MAGIC_NUMBER]: {
    message: 'Wrong Magic Number',
    doRetry: false,
  },
  [DeviceBootloaderErrorType.SIGNATURE_NOT_VERIFIED]: {
    message: 'Signature not verified',
    doRetry: false,
  },
  [DeviceBootloaderErrorType.LOWER_FIRMWARE_VERSION]: {
    message: 'Lower Firmware version',
    doRetry: false,
  },
  [DeviceBootloaderErrorType.FLASH_WRITE_ERROR]: {
    message: 'Flash Write Error',
    doRetry: true,
  },
  [DeviceBootloaderErrorType.FLASH_CRC_MISMATCH]: {
    message: 'Flash CRC Mismatch',
    doRetry: true,
  },
  [DeviceBootloaderErrorType.FLASH_TIMEOUT_ERROR]: {
    message: 'Flash Timeout Error',
    doRetry: false,
  },
  [DeviceBootloaderErrorType.FLASH_NACK]: {
    message: 'Flash Negative Acknowledgement',
    doRetry: true,
  },
  [DeviceBootloaderErrorType.NOT_IN_RECEIVING_MODE]: {
    message: 'The device is in fault state',
    doRetry: false,
  },
};

export class DeviceBootloaderError extends Error {
  public code: DeviceBootloaderErrorType;

  public message: string;

  public doRetry: boolean;

  constructor(errorCode: DeviceBootloaderErrorType) {
    super();
    this.code = errorCode;
    this.message = errorObjects[this.code].message;
    this.doRetry = errorObjects[this.code].doRetry;

    if ((<any>Object).setPrototypeOf) {
      (<any>Object).setPrototypeOf(this, DeviceBootloaderError.prototype);
    } else {
      // eslint-disable-next-line
      (<any>this).__proto__ = DeviceBootloaderError.prototype;
    }
  }
}
