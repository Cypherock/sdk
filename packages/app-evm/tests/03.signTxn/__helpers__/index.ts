import * as superMocks from '../../__helpers__';
import { ISignTxnTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: ISignTxnTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: ISignTxnTestCase) {
  superMocks.expectMockCalls(testCase);
}
