import { ISDK, Status } from '@cypherock/sdk-core';
import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { DeepPartial, Exact, Query, Result } from '../proto/generated/btc/core';
import { assertOrThrowInvalidResult, parseCoreError } from './asserts';

export function decodeResult(data: Uint8Array) {
  let result: Result;

  try {
    result = Result.decode(data);
  } catch (error) {
    throw new DeviceAppError(DeviceAppErrorType.INVALID_RESULT);
  }

  return result;
}

export function encodeQuery<I extends Exact<DeepPartial<Query>, I>>(query: I) {
  return Uint8Array.from(Query.encode(Query.create(query)).finish());
}

type QueryKey = keyof Query;

type ResultKey = keyof Result;

export class OperationHelper<Q extends QueryKey, R extends ResultKey> {
  public readonly sdk: ISDK;

  private readonly queryKey: QueryKey;

  private readonly resultKey: ResultKey;

  constructor(sdk: ISDK, queryKey: Q, resultKey: R) {
    this.sdk = sdk;

    this.queryKey = queryKey;

    this.resultKey = resultKey;
  }

  public async sendQuery<I extends Query[Q]>(query: I) {
    return this.sdk.sendQuery(encodeQuery({ [this.queryKey]: query } as any));
  }

  public async waitForResult(onStatus?: (status: Status) => void) {
    const result = decodeResult(await this.sdk.waitForResult({ onStatus }));

    const retrunObj = result[this.resultKey] as Result[R];
    assertOrThrowInvalidResult(retrunObj);
    parseCoreError((result[this.resultKey] as any).coreError);

    return retrunObj;
  }
}
