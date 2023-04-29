import * as superMocks from '../../__helpers__';

import { IGetLogsTestCase } from '../__fixtures__';

export function setupMocks(testCase: IGetLogsTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: IGetLogsTestCase) {
  superMocks.expectMockCalls(testCase);
}
