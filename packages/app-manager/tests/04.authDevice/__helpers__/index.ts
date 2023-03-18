import { expect, jest } from '@jest/globals';

import * as sdkMocks from '../../../src/__mocks__/sdk';
import * as deviceAuthServiceMocks from '../../../src/__mocks__/deviceAuthService';
import { getDeviceInfo as getDeviceInfoMock } from '../../../src/__mocks__/getDeviceInfo';

import { IAuthDeviceTestCase } from '../__fixtures__';

const onEvent = jest.fn();

export function setupMocks(testCase: IAuthDeviceTestCase) {
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

  deviceAuthServiceMocks.verifySerialSignature.mockReturnValueOnce(
    testCase.mocks.challenge,
  );
  deviceAuthServiceMocks.verifyChallengeSignature.mockReturnValueOnce(
    testCase.mocks.challengeVerified,
  );
  getDeviceInfoMock.mockReturnValueOnce(testCase.mocks.deviceInfo);

  return onEvent;
}

export function clearMocks() {
  onEvent.mockClear();

  sdkMocks.create.mockClear();

  sdkMocks.sendQuery.mockReset();
  sdkMocks.waitForResult.mockReset();

  sdkMocks.runOperation.mockClear();

  deviceAuthServiceMocks.verifySerialSignature.mockReset();
  deviceAuthServiceMocks.verifyChallengeSignature.mockReset();

  getDeviceInfoMock.mockReset();
}

export function expectMockCalls(testCase: IAuthDeviceTestCase) {
  expect(sdkMocks.runOperation).toHaveBeenCalledTimes(1);
  expect(sdkMocks.sendQuery.mock.calls.map(elem => elem[0])).toEqual(
    testCase.queries.map(elem => elem.data),
  );
  expect(onEvent.mock.calls).toEqual(testCase.mocks.eventCalls);
}
