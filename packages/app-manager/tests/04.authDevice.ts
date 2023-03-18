import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { getDeviceInfo as getDeviceInfoMock } from '../src/__mocks__/getDeviceInfo';
import * as sdkMocks from '../src/__mocks__/sdk';
import * as deviceAuthServiceMocks from '../src/__mocks__/deviceAuthService';
import { ManagerApp } from '../src/index';
import fixtures, { IAuthDeviceTestCase } from './__fixtures__/04.authDevice';

const onEvent = jest.fn();

function setupMocks(testCase: IAuthDeviceTestCase) {
  testCase.queries.forEach(() => {
    sdkMocks.sendQuery.mockReturnValueOnce(Promise.resolve(undefined));
  });

  testCase.results.forEach(result => {
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
}

function clearMocks() {
  onEvent.mockClear();

  sdkMocks.create.mockClear();

  sdkMocks.sendQuery.mockReset();
  sdkMocks.waitForResult.mockReset();

  sdkMocks.runOperation.mockClear();

  deviceAuthServiceMocks.verifySerialSignature.mockReset();
  deviceAuthServiceMocks.verifyChallengeSignature.mockReset();

  getDeviceInfoMock.mockReset();
}

describe('managerApp.authDevice', () => {
  let connection: MockDeviceConnection;
  let managerApp: ManagerApp;

  beforeEach(async () => {
    clearMocks();

    connection = await MockDeviceConnection.create();
    managerApp = await ManagerApp.create(connection);
  });

  afterEach(async () => {
    await managerApp.destroy();
  });

  describe('should be able perform device auth', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const output = await managerApp.authDevice(onEvent);

        expect(output).toEqual(testCase.output);
        expect(sdkMocks.runOperation).toHaveBeenCalledTimes(1);
        expect(sdkMocks.sendQuery.mock.calls.map(elem => elem[0])).toEqual(
          testCase.queries.map(elem => elem.data),
        );
        expect(onEvent.mock.calls).toEqual(testCase.mocks.eventCalls);
      });
    });
  });

  describe('should throw error when device returns invalid data', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        await expect(managerApp.authDevice()).rejects.toThrow(
          testCase.errorInstance,
        );
      });
    });
  });
});
