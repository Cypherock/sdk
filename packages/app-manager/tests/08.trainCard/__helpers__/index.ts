import * as superMocks from '../../__helpers__';
import { ITrainCardTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: ITrainCardTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: ITrainCardTestCase) {
  superMocks.expectMockCalls(testCase);
}
