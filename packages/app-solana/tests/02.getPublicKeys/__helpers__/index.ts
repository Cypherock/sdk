import * as superMocks from '../../__helpers__';
import { IGetPublicKeysTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: IGetPublicKeysTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: IGetPublicKeysTestCase) {
  superMocks.expectMockCalls(testCase);
}
