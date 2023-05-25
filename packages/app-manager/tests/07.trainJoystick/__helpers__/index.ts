import * as superMocks from '../../__helpers__';

import { ITrainJoystickTestCase } from '../__fixtures__';

export function setupMocks(testCase: ITrainJoystickTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: ITrainJoystickTestCase) {
  superMocks.expectMockCalls(testCase);
}
