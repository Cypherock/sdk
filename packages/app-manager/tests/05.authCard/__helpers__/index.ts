import { expect, jest } from '@jest/globals';

import * as sdkMocks from '../../../src/__mocks__/sdk';
import * as verificationServiceMocks from '../../../src/__mocks__/authVerificationService';

import { IAuthCardTestCase } from '../__fixtures__';

const onEvent = jest.fn();

export function setupMocks(testCase: IAuthCardTestCase) {
  testCase.queries.forEach(() => {
    sdkMocks.sendQuery.mockReturnValueOnce(Promise.resolve(undefined));
  });

  testCase.results.forEach(result => {
    /*
     * 1. Simulate calling onStatus event for waitForResult
     * 2. Expect the onEvent to be called as described in the testCase
     */
    sdkMocks.waitForResult.mockImplementationOnce(async params => {
      if (params?.onStatus && result.statuses) {
        let onEventCalls = 0;

        for (const status of result.statuses) {
          params.onStatus({ flowStatus: status.flowStatus } as any);

          if (status.expectEventCalls !== undefined) {
            for (let i = 0; i < status.expectEventCalls.length; i += 1) {
              const mockIndex =
                onEvent.mock.calls.length - status.expectEventCalls.length + i;

              expect(onEvent.mock.calls[mockIndex]).toEqual([
                status.expectEventCalls[i],
              ]);
            }

            onEventCalls += status.expectEventCalls.length;
            expect(onEvent).toHaveBeenCalledTimes(onEventCalls);
          } else {
            expect(onEvent).toHaveBeenCalledTimes(onEventCalls);
          }
        }
      }

      return result.data;
    });
  });

  if (testCase.mocks) {
    verificationServiceMocks.verifySerialSignature.mockReturnValueOnce(
      testCase.mocks.challenge,
    );
    verificationServiceMocks.verifyChallengeSignature.mockReturnValueOnce(
      testCase.mocks.challengeVerified,
    );
  }

  return onEvent;
}

export function clearMocks() {
  onEvent.mockClear();

  sdkMocks.create.mockClear();

  sdkMocks.sendQuery.mockReset();
  sdkMocks.waitForResult.mockReset();

  sdkMocks.runOperation.mockClear();

  verificationServiceMocks.verifySerialSignature.mockReset();
  verificationServiceMocks.verifyChallengeSignature.mockReset();
}

export function expectMockCalls(testCase: IAuthCardTestCase) {
  expect(sdkMocks.runOperation).toHaveBeenCalledTimes(1);
  expect(sdkMocks.sendQuery.mock.calls.map(elem => elem[0])).toEqual(
    testCase.queries.map(elem => elem.data),
  );

  if (!testCase.mocks) return;

  if (testCase.mocks.eventCalls) {
    expect(onEvent.mock.calls).toEqual(testCase.mocks.eventCalls);
  }

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
