import * as superMocks from '../../__helpers__';
import { IGetPublicKeyTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: IGetPublicKeyTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: IGetPublicKeyTestCase) {
  superMocks.expectMockCalls(testCase);
}
