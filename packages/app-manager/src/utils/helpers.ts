import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

import {
  DeepPartial,
  Exact,
  Query,
  Result,
} from '../proto/generated/manager/core';

export function decodeResult(data: Uint8Array) {
  let result: Result;

  try {
    result = Result.decode(data);
  } catch (error) {
    throw new DeviceAppError(DeviceAppErrorType.INVALID_RESULT);
  }

  return result;
}

export function assertOrThrowInvalidResult<T>(
  condition: T,
): asserts condition is Exclude<T, null | undefined> {
  assert(condition, new DeviceAppError(DeviceAppErrorType.INVALID_RESULT));
}

export function encodeQuery<I extends Exact<DeepPartial<Query>, I>>(query: I) {
  return Uint8Array.from(Query.encode(Query.create(query)).finish());
}
