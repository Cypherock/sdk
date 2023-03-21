import * as superMocks from '../../__helpers__';

import { ITrainUserTestCase } from '../__fixtures__';

export function setupMocks(testCase: ITrainUserTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: ITrainUserTestCase) {
  superMocks.expectMockCalls(testCase);
}
