import * as superMocks from '../../__helpers__';
import { IAuthWalletTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: IAuthWalletTestCase) {
  return superMocks.setupMocks(testCase);
}

export function clearMocks() {
  superMocks.clearMocks();
}

export function expectMockCalls(testCase: IAuthWalletTestCase) {
  superMocks.expectMockCalls(testCase);
}
