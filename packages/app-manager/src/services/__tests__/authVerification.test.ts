import { beforeEach, describe, expect, test } from '@jest/globals';
import fixtures from '../__fixtures__/authVerification';
import * as httpMocks from '../../__mocks__/http';

import {
  verifySerialSignature,
  verifyChallengeSignature,
} from '../authVerification';

describe('deviceAuth Service', () => {
  beforeEach(async () => {
    httpMocks.post.mockReset();
  });

  describe('verifySerialSignature', () => {
    describe('should be able to return valid responses', () => {
      fixtures.verifySerialSignature.valid.forEach(testCase => {
        test(testCase.name, async () => {
          testCase.httpPostMocks.results.forEach(result =>
            httpMocks.post.mockReturnValueOnce(Promise.resolve(result)),
          );

          const challenge = await verifySerialSignature(testCase.params);
          expect(challenge).toEqual(testCase.result);
          expect(httpMocks.post.mock.calls).toEqual(
            testCase.httpPostMocks.calls,
          );
        });
      });
    });
  });

  describe('verifyChallengeSignature', () => {
    describe('should be able to return valid responses', () => {
      fixtures.verifyChallengeSignature.valid.forEach(testCase => {
        test(testCase.name, async () => {
          testCase.httpPostMocks.results.forEach(result =>
            httpMocks.post.mockReturnValueOnce(Promise.resolve(result)),
          );

          const challenge = await verifyChallengeSignature(testCase.params);
          expect(challenge.isVerified).toEqual(testCase.result);
          expect(httpMocks.post.mock.calls).toEqual(
            testCase.httpPostMocks.calls,
          );
        });
      });
    });
  });
});
