import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';
import { ICoreError } from '../proto/generated/types';

export function assertOrThrowInvalidResult<T>(
  condition: T,
): asserts condition is Exclude<T, null | undefined> {
  assert(condition, new DeviceAppError(DeviceAppErrorType.INVALID_RESULT));
}

export function parseCoreError(error?: ICoreError) {
  if (error === undefined) return;

  type CoreErrorKey = keyof ICoreError;
  const keys = Object.keys(error) as CoreErrorKey[];

  const errorTypesMap: Record<CoreErrorKey, DeviceAppErrorType> = {
    unknownError: DeviceAppErrorType.UNKNOWN_ERROR,
    invalidAppId: DeviceAppErrorType.INVALID_APP_ID_ON_DEVICE,
    invalidResult: DeviceAppErrorType.INVALID_RESULT_ON_DEVICE,
    deviceSetupRequired: DeviceAppErrorType.DEVICE_SETUP_REQUIRED,
    walletNotFound: DeviceAppErrorType.WALLET_NOT_FOUND,
    walletPartialState: DeviceAppErrorType.WALLET_PARTIAL_STATE,
    noWalletExists: DeviceAppErrorType.NO_WALLET_EXISTS,
    cardError: DeviceAppErrorType.CARD_OPERATION_FAILED,
    userRejection: DeviceAppErrorType.USER_REJECTION,
  };

  for (const key of keys) {
    if (error[key] !== undefined) {
      throw new DeviceAppError(errorTypesMap[key]);
    }
  }
}
