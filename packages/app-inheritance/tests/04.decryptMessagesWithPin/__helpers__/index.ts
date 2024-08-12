import * as superMocks from '../../__helpers__';
import { IDecryptMessagesTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: IDecryptMessagesTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: IDecryptMessagesTestCase) {
  superMocks.expectMockCalls(testCase);
}
