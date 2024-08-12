import * as superMocks from '../../__helpers__';
import { IEncryptMessagesTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: IEncryptMessagesTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: IEncryptMessagesTestCase) {
  superMocks.expectMockCalls(testCase);
}
