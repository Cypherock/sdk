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

export function createStatusListener(
  enums: object,
  onEvent?: (event: number) => void,
) {
  const alreadySent: Record<number, boolean> = {};

  // Gets the flow status list as numbers from enums
  const statusList = Object.keys(enums)
    .filter(e => !Number.isNaN(Number(e)))
    .map(e => parseInt(e, 10))
    .filter(e => e >= 0)
    .sort();

  const onStatus = (status: { flowStatus: number }) => {
    for (const eventIndex of statusList) {
      if (status.flowStatus >= eventIndex && !alreadySent[eventIndex]) {
        alreadySent[eventIndex] = true;
        if (onEvent) {
          onEvent(eventIndex);
        }
      }
    }
  };

  const forceStatusUpdate = (flowStatus: number) => {
    onStatus({ flowStatus });
  };

  return { onStatus, forceStatusUpdate };
}
