import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';
import fixtures from './__fixtures__';

import { ManagerApp } from '../../src/index';

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
        const onEvent = setupMocks(testCase);

        await managerApp.authDevice({ onEvent });

        expectMockCalls(testCase);
      });
    });
  });

  describe('should throw error when device returns invalid data', () => {
    fixtures.invalidData.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        await expect(managerApp.authDevice()).rejects.toThrow(
          testCase.errorInstance,
        );
      });
    });
  });

  describe('should throw error when device returns error', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        const onEvent = setupMocks(testCase);

        const authDevicePromise = managerApp.authDevice({ onEvent });

        await expect(authDevicePromise).rejects.toThrow(testCase.errorInstance);
        if (testCase.errorMessage) {
          try {
            await authDevicePromise;
          } catch (error: any) {
            expect(error.message).toMatch(testCase.errorMessage);
          }
        }
      });
    });
  });
});
