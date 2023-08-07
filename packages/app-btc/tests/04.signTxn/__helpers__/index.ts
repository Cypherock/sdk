import * as superMocks from '../../__helpers__';
import { ISignTxnTestCase } from '../__fixtures__/types';
import { Query, Result } from '../../../src/proto/generated/btc/core';

export function setupMocks(testCase: ISignTxnTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: ISignTxnTestCase) {
  superMocks.expectMockCalls(testCase);
}

export function queryToUint8Array(queryData: Query): Uint8Array {
  return Uint8Array.from(Query.encode(Query.create(queryData)).finish());
}

export function resultToUint8Array(resultData: Result): Uint8Array {
  return Uint8Array.from(Result.encode(Result.create(resultData)).finish());
}
