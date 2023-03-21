import { DeviceError } from '@cypherock/sdk-interfaces';

export enum GetLogsErrorType {
  LOGS_DISABLED = 'MGA_GL_0000',
}

type CodeToErrorMap = {
  [property in GetLogsErrorType]: {
    message: string;
  };
};

export const getLogsErrorTypeDetails: CodeToErrorMap = {
  [GetLogsErrorType.LOGS_DISABLED]: {
    message: 'Logs are disabled on the device',
  },
};

export class GetLogsError extends DeviceError {
  constructor(errorCode: GetLogsErrorType) {
    super(errorCode, getLogsErrorTypeDetails[errorCode].message, GetLogsError);
  }
}
