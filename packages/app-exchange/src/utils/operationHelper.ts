import { ISDK } from '@cypherock/sdk-core';
import { DeviceAppError, DeviceAppErrorType } from '@cypherock/sdk-interfaces';
import { OnStatus } from '@cypherock/sdk-utils';
import { ChunkAck, ChunkPayload } from '../proto/generated/common';
import {
  DeepPartial,
  Exact,
  Query,
  Result,
} from '../proto/generated/exchnage/core';
import { assertOrThrowInvalidResult, parseCommonError } from './asserts';

export function decodeResult(data: Uint8Array) {
  let result: Result;

  try {
    result = Result.decode(data);
  } catch (error) {
    throw new DeviceAppError(DeviceAppErrorType.INVALID_MSG_FROM_DEVICE);
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

  private readonly onStatus?: OnStatus;

  private static readonly CHUNK_SIZE = 2048;

  constructor(params: {
    sdk: ISDK;
    queryKey: Q;
    resultKey: R;
    onStatus?: OnStatus;
  }) {
    this.sdk = params.sdk;

    this.queryKey = params.queryKey;

    this.resultKey = params.resultKey;

    this.onStatus = params.onStatus;
  }

  public async sendQuery<I extends Query[Q]>(query: I) {
    return this.sdk.sendQuery(encodeQuery({ [this.queryKey]: query } as any));
  }

  public async waitForResult() {
    const result = decodeResult(
      await this.sdk.waitForResult({ onStatus: this.onStatus }),
    );

    const resultData = result[this.resultKey] as Result[R];
    parseCommonError(result.commonError);
    assertOrThrowInvalidResult(resultData);
    parseCommonError((result[this.resultKey] as any).commonError);

    return resultData;
  }

  private static splitIntoChunks(rawData: Uint8Array): Uint8Array[] {
    const chunks: Uint8Array[] = [];
    const totalChunks = Math.ceil(rawData.length / OperationHelper.CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i += 1) {
      const chunk = rawData.slice(
        i * OperationHelper.CHUNK_SIZE,
        i * OperationHelper.CHUNK_SIZE + OperationHelper.CHUNK_SIZE,
      );
      chunks.push(chunk);
    }

    return chunks;
  }

  public async sendInChunks<
    RK extends keyof Exclude<Result[R], null | undefined>,
    QK extends keyof Exclude<Query[Q], null | undefined>,
  >(data: Uint8Array, queryKey: QK, resultKey: RK) {
    const chunks = OperationHelper.splitIntoChunks(data);
    let remainingSize = data.length;
    let i = 0;

    do {
      const chunk = chunks[i] ?? [];
      remainingSize -= chunk.length;

      const chunkPayload: ChunkPayload = {
        chunk,
        chunkIndex: i,
        totalChunks: Math.max(chunks.length, 1),
        remainingSize,
      };

      await this.sendQuery({
        [queryKey]: {
          chunkPayload,
        },
      });

      const result = await this.waitForResult();
      assertOrThrowInvalidResult(result[resultKey]);

      const { chunkAck } = result[resultKey] as {
        chunkAck: ChunkAck;
      };

      assertOrThrowInvalidResult(chunkAck);
      assertOrThrowInvalidResult(chunkAck.chunkIndex === i);
      i += 1;
    } while (i < chunks.length);
  }

  public async receiveInChunks<
    RK extends keyof Exclude<Result[R], null | undefined>,
    QK extends keyof Exclude<Query[Q], null | undefined>,
  >(queryKey: QK, resultKey: RK): Promise<Uint8Array> {
    const chunks: Uint8Array[] = [];

    let index = 0;

    while (1) {
      const chunkAck: ChunkAck = {
        chunkIndex: index,
      };
      await this.sendQuery({ [queryKey]: { chunkAck } });

      const chunk = await this.waitForResult();
      assertOrThrowInvalidResult(chunk[resultKey]);

      const { chunkPayload } = chunk[resultKey] as {
        chunkPayload: ChunkPayload;
      };
      assertOrThrowInvalidResult(
        chunkPayload.chunkIndex === chunkAck.chunkIndex,
      );

      chunks.push(chunkPayload.chunk);

      if (
        chunkPayload.remainingSize === 0 &&
        chunkPayload.chunkIndex + 1 >= chunkPayload.totalChunks
      ) {
        break;
      }

      index += 1;
    }
    return new Uint8Array(Buffer.concat(chunks));
  }
}
