import {
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceConnectionError,
} from '@cypherock/sdk-interfaces';

const canRetry = (error: Error) => {
  let dontRetry = false;
  // Don't retry if connection closed
  dontRetry ||= error instanceof DeviceConnectionError;

  // Don't retry if write was rejected
  dontRetry ||=
    error instanceof DeviceCommunicationError &&
    (error as DeviceCommunicationError).code ===
      DeviceCommunicationErrorType.WRITE_REJECTED;
  dontRetry ||=
    error instanceof DeviceAppError &&
    [
      DeviceAppErrorType.PROCESS_ABORTED,
      DeviceAppErrorType.DEVICE_ABORT,
    ].includes((error as DeviceAppError).code);

  return !dontRetry;
};

export default canRetry;
