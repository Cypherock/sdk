import { expect } from '@jest/globals';

import * as superMocks from '../../__helpers__';
import * as verificationServiceMocks from '../../../src/__mocks__/authVerificationService';
import { getDeviceInfo as getDeviceInfoMock } from '../../../src/__mocks__/getDeviceInfo';

import { IAuthDeviceTestCase } from '../__fixtures__';

export function setupMocks(testCase: IAuthDeviceTestCase) {
  const onEvent = superMocks.setupMocks(testCase);

  verificationServiceMocks.verifySerialSignature.mockReturnValueOnce(
    testCase.mocks.challenge,
  );
  verificationServiceMocks.verifyChallengeSignature.mockReturnValueOnce({
    isVerified: testCase.mocks.challengeVerified,
  });
  getDeviceInfoMock.mockReturnValueOnce(testCase.mocks.deviceInfo);

  return onEvent;
}

export function clearMocks() {
  superMocks.clearMocks();

  verificationServiceMocks.verifySerialSignature.mockReset();
  verificationServiceMocks.verifyChallengeSignature.mockReset();

  getDeviceInfoMock.mockReset();
}

export function expectMockCalls(testCase: IAuthDeviceTestCase) {
  superMocks.expectMockCalls(testCase);

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
