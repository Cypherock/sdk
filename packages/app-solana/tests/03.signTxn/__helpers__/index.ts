import * as superMocks from '../../__helpers__';
import { ISignTxnTestCase } from '../__fixtures__/types';
import { Query, Result } from '../../../src/proto/generated/solana/core';
import * as serviceMocks from '../../../src/__mocks__/service';

export function setupMocks(testCase: ISignTxnTestCase) {
  serviceMocks.getLatestBlockHash.mockReturnValueOnce(
    testCase.mocks?.latestBlockHash,
  );

  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  serviceMocks.getLatestBlockHash.mockReset();
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
