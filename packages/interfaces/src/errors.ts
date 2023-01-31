export enum DeviceErrorType {
  NOT_CONNECTED = 'HD_INIT_1001',

  DEVICE_DISCONNECTED_IN_FLOW = 'HD_INIT_1010',
  CONNECTION_CLOSED = 'HD_INIT_1011',
  CONNECTION_NOT_OPEN = 'HD_INIT_1012',

  WRITE_ERROR = 'HD_COM_1007',

  TIMEOUT_ERROR = 'HD_COM_1050',
  WRITE_TIMEOUT = 'HD_COM_1051',
  READ_TIMEOUT = 'HD_COM_1052',
  DEVICE_ABORT = 'HD_COM_2000',

  FIRMWARE_SIZE_LIMIT_EXCEEDED = 'HD_FIRM_1001',
  WRONG_HARDWARE_VERSION = 'HD_FIRM_1003',
  WRONG_MAGIC_NUMBER = 'HD_FIRM_1004',
  SIGNATURE_NOT_VERIFIED = 'HD_FIRM_1005',
  LOWER_FIRMWARE_VERSION = 'HD_FIRM_1006',
  NOT_IN_RECEIVING_MODE = 'HD_FIRM_1007',
  FLASH_WRITE_ERROR = 'HD_FIRM_1008',
  FLASH_CRC_MISMATCH = 'HD_FIRM_1009',
  FLASH_TIMEOUT_ERROR = 'HD_FIRM_1010',
  FLASH_NACK = 'HD_FIRM_1011',

  NO_WORKING_PACKET_VERSION = 'HD_INIT_2006',
  UNKNOWN_COMMUNICATION_ERROR = 'HD_COM_5500',
  WRITE_REJECTED = 'HD_COM_5001',
  EXECUTING_OTHER_COMMAND = 'HD_COM_5002',
  PROCESS_ABORTED_BY_USER = 'HD_COM_5100'
}

type CodeToErrorMap = {
  [property in DeviceErrorType]: {
    message: string;
    doRetry: boolean;
  };
};

const errorObjects: CodeToErrorMap = {
  [DeviceErrorType.NOT_CONNECTED]: {
    message: 'No device connected',
    doRetry: false
  },

  [DeviceErrorType.DEVICE_DISCONNECTED_IN_FLOW]: {
    message: 'Device disconnected in flow',
    doRetry: false
  },
  [DeviceErrorType.CONNECTION_CLOSED]: {
    message: 'Connection was closed while in process',
    doRetry: false
  },
  [DeviceErrorType.CONNECTION_NOT_OPEN]: {
    message: 'Connection was not open',
    doRetry: false
  },

  [DeviceErrorType.WRITE_ERROR]: {
    message: 'Unable to write packet to the device',
    doRetry: true
  },

  [DeviceErrorType.TIMEOUT_ERROR]: {
    message: 'Timeout Error due to write/read',
    doRetry: true
  },
  [DeviceErrorType.WRITE_TIMEOUT]: {
    message: 'Did not receive ACK of sent packet on time',
    doRetry: true
  },
  [DeviceErrorType.READ_TIMEOUT]: {
    message: 'Did not receive the expected data from device on time',
    doRetry: true
  },
  [DeviceErrorType.DEVICE_ABORT]: {
    message: 'The request was timed out on the device',
    doRetry: true
  },

  [DeviceErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED]: {
    message: 'Firmware Size Limit Exceed',
    doRetry: false
  },
  [DeviceErrorType.WRONG_HARDWARE_VERSION]: {
    message: 'Wrong Hardware version',
    doRetry: false
  },
  [DeviceErrorType.WRONG_MAGIC_NUMBER]: {
    message: 'Wrong Magic Number',
    doRetry: false
  },
  [DeviceErrorType.SIGNATURE_NOT_VERIFIED]: {
    message: 'Signature not verified',
    doRetry: false
  },
  [DeviceErrorType.LOWER_FIRMWARE_VERSION]: {
    message: 'Lower Firmware version',
    doRetry: false
  },
  [DeviceErrorType.FLASH_WRITE_ERROR]: {
    message: 'Flash Write Error',
    doRetry: true
  },
  [DeviceErrorType.FLASH_CRC_MISMATCH]: {
    message: 'Flash CRC Mismatch',
    doRetry: true
  },
  [DeviceErrorType.FLASH_TIMEOUT_ERROR]: {
    message: 'Flash Timeout Error',
    doRetry: false
  },
  [DeviceErrorType.FLASH_NACK]: {
    message: 'Flash Negative Acknowledgement',
    doRetry: true
  },

  [DeviceErrorType.NO_WORKING_PACKET_VERSION]: {
    message: 'No working packet version',
    doRetry: false
  },
  [DeviceErrorType.UNKNOWN_COMMUNICATION_ERROR]: {
    message: 'Unknown Error at communication module',
    doRetry: true
  },
  [DeviceErrorType.WRITE_REJECTED]: {
    message: 'The write packet operation was rejected by the device',
    doRetry: false
  },
  [DeviceErrorType.EXECUTING_OTHER_COMMAND]: {
    message: 'The device is executing some other command',
    doRetry: false
  },
  [DeviceErrorType.NOT_IN_RECEIVING_MODE]: {
    message: 'The device is in fault state',
    doRetry: false
  },
  [DeviceErrorType.PROCESS_ABORTED_BY_USER]: {
    message: 'Abort process dont care',
    doRetry: false
  }
};

export class DeviceError extends Error {
  // remove below line
  public errorType: DeviceErrorType;

  public code: DeviceErrorType;

  public message: string;

  public doRetry: boolean;

  constructor(errorCode: DeviceErrorType) {
    super();
    this.code = errorCode || DeviceErrorType.UNKNOWN_COMMUNICATION_ERROR;
    // remove below line
    this.errorType = errorCode || DeviceErrorType.UNKNOWN_COMMUNICATION_ERROR;
    this.message = errorObjects[this.errorType].message;
    this.doRetry = errorObjects[this.errorType].doRetry;

    if ((<any>Object).setPrototypeOf) {
      (<any>Object).setPrototypeOf(this, DeviceError.prototype);
    } else {
      // eslint-disable-next-line
      (<any>this).__proto__ = DeviceError.prototype;
    }
  }
}
