import { DeviceError } from '@cypherock/sdk-interfaces';

export enum UpdateFirmwareErrorType {
  UNKNOWN_ERROR = 'MGA_UF_0000',

  VERSION_NOT_ALLOWED = 'MGA_UF_0100',
}

type CodeToErrorMap = {
  [property in UpdateFirmwareErrorType]: {
    message: string;
  };
};

export const updateFirmwareErrorTypeDetails: CodeToErrorMap = {
  [UpdateFirmwareErrorType.UNKNOWN_ERROR]: {
    message: 'Unknown firmware update error',
  },
  [UpdateFirmwareErrorType.VERSION_NOT_ALLOWED]: {
    message: 'Given firmware version is not allowed',
  },
};

export class UpdateFirmwareError extends DeviceError {
  constructor(errorCode: UpdateFirmwareErrorType) {
    super(
      errorCode,
      updateFirmwareErrorTypeDetails[errorCode].message,
      UpdateFirmwareError,
    );
  }
}
