import { beforeEach, describe, expect, test } from '@jest/globals';
import fixtures from '../__fixtures__/authVerification';
import * as axiosMocks from '../../__mocks__/axios';

import {
  verifySerialSignature,
  verifyChallengeSignature,
} from '../authVerification';

describe('deviceAuth Service', () => {
  beforeEach(async () => {
    axiosMocks.post.mockReset();
  });

  describe('verifySerialSignature', () => {
    describe('should be able to return valid responses', () => {
      fixtures.verifySerialSignature.valid.forEach(testCase => {
        test(testCase.name, async () => {
          testCase.axiosPostMocks.results.forEach(result =>
            axiosMocks.post.mockReturnValueOnce(Promise.resolve(result)),
          );

          const challenge = await verifySerialSignature(testCase.params);
          expect(challenge).toEqual(testCase.result);
          expect(axiosMocks.post.mock.calls).toEqual(
            testCase.axiosPostMocks.calls,
          );
        });
      });
    });
  });

  describe('verifyChallengeSignature', () => {
    describe('should be able to return valid responses', () => {
      fixtures.verifyChallengeSignature.valid.forEach(testCase => {
        test(testCase.name, async () => {
          testCase.axiosPostMocks.results.forEach(result =>
            axiosMocks.post.mockReturnValueOnce(Promise.resolve(result)),
          );

          const challenge = await verifyChallengeSignature(testCase.params);
          expect(challenge.isVerified).toEqual(testCase.result);
          expect(axiosMocks.post.mock.calls).toEqual(
            testCase.axiosPostMocks.calls,
          );
        });
      });
    });
  });
});
