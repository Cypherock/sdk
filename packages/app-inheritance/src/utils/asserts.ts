import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';
import { ICommonError } from '../proto/generated/types';

export function assertOrThrowInvalidResult<T>(
  condition: T,
): asserts condition is Exclude<T, null | undefined> {
  assert(
    condition,
    new DeviceAppError(DeviceAppErrorType.INVALID_MSG_FROM_DEVICE),
  );
}

export function parseCommonError(error?: ICommonError) {
  if (error === undefined) return;

  type CommonErrorKey = keyof ICommonError;
  const keys = Object.keys(error) as CommonErrorKey[];

  const errorTypesMap: Record<CommonErrorKey, DeviceAppErrorType> = {
    unknownError: DeviceAppErrorType.UNKNOWN_ERROR,
    deviceSetupRequired: DeviceAppErrorType.DEVICE_SETUP_REQUIRED,
    walletNotFound: DeviceAppErrorType.WALLET_NOT_FOUND,
    walletPartialState: DeviceAppErrorType.WALLET_PARTIAL_STATE,
    cardError: DeviceAppErrorType.CARD_OPERATION_FAILED,
    userRejection: DeviceAppErrorType.USER_REJECTION,
    corruptData: DeviceAppErrorType.CORRUPT_DATA,
  };

  for (const key of keys) {
    if (error[key] !== undefined) {
      throw new DeviceAppError(errorTypesMap[key], error[key]);
    }
  }
}
