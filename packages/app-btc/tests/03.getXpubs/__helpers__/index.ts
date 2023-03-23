import * as superMocks from '../../__helpers__';
import { IGetXpubsTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: IGetXpubsTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: IGetXpubsTestCase) {
  superMocks.expectMockCalls(testCase);
}
