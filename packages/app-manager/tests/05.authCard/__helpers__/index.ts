import { expect } from '@jest/globals';

import * as superMocks from '../../__helpers__';
import * as verificationServiceMocks from '../../../src/__mocks__/authVerificationService';

import { IAuthCardTestCase } from '../__fixtures__';

export function setupMocks(testCase: IAuthCardTestCase) {
  const onEvent = superMocks.setupMocks(testCase);

  if (testCase.mocks) {
    verificationServiceMocks.verifySerialSignature.mockReturnValueOnce(
      testCase.mocks.challenge,
    );
    verificationServiceMocks.verifyChallengeSignature.mockReturnValueOnce({
      isVerified: testCase.mocks.challengeVerified,
    });
  }

  return onEvent;
}

export function clearMocks() {
  superMocks.clearMocks();

  verificationServiceMocks.verifySerialSignature.mockReset();
  verificationServiceMocks.verifyChallengeSignature.mockReset();
}

export function expectMockCalls(testCase: IAuthCardTestCase) {
  superMocks.expectMockCalls(testCase);

  if (!testCase.mocks) return;

  if (testCase.mocks.verifyChallengeSignatureCalls) {
    expect(
      verificationServiceMocks.verifyChallengeSignature.mock.calls,
    ).toEqual(testCase.mocks.verifyChallengeSignatureCalls);
  }

  if (testCase.mocks.verifySerialSignatureCalls) {
    expect(verificationServiceMocks.verifySerialSignature.mock.calls).toEqual(
      testCase.mocks.verifySerialSignatureCalls,
    );
  }
}
