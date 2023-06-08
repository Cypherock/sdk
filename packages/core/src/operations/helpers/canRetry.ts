import {
  DeviceAppError,
  DeviceAppErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';

const canRetry = (error: Error) => {
  let dontRetry = false;
  // Don't retry if connection closed
  dontRetry ||= Object.values(DeviceConnectionErrorType).includes(
    (error as any)?.code,
  );

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
    ].includes(error.code as any);

  return !dontRetry;
};

export default canRetry;
