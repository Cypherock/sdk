import { Msg } from '../../../src/encoders/proto/generated/core';

export * from './mocks';

export function msgToUint8Array(queryData: Msg): Uint8Array {
  return Uint8Array.from(Msg.encode(Msg.create(queryData)).finish());
}
