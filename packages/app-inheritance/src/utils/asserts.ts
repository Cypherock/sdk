import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

export function assertOrThrowInvalidResult<T>(
  condition: T,
): asserts condition is Exclude<T, null | undefined> {
  assert(
    condition,
    new DeviceAppError(DeviceAppErrorType.INVALID_MSG_FROM_DEVICE),
  );
}
