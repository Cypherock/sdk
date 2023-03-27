import * as superMocks from '../../__helpers__';
import { ISignPersonalMsgTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: ISignPersonalMsgTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: ISignPersonalMsgTestCase) {
  superMocks.expectMockCalls(testCase);
}
