import { beforeEach, describe, expect, test } from '@jest/globals';
import fixtures from '../__fixtures__/deviceAuth';
import * as httpMocks from '../../__mocks__/http';

import { deviceAuthService } from '..';

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

          const challenge = await deviceAuthService.verifySerialSignature(
            testCase.params,
          );
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

          const challenge = await deviceAuthService.verifyChallengeSignature(
            testCase.params,
          );
          expect(challenge).toEqual(testCase.result);
          expect(httpMocks.post.mock.calls).toEqual(
            testCase.httpPostMocks.calls,
          );
        });
      });
    });
  });
});
