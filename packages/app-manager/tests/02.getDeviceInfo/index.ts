import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';
import fixtures from './__fixtures__';

import { ManagerApp } from '../../src/index';

describe('managerApp.getDeviceInfo', () => {
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

  describe('should be able to get info', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const output = await managerApp.getDeviceInfo();
        expect(output).toEqual(testCase.output);

        expectMockCalls(testCase);
      });
    });
  });

  describe('should throw error when device returns invalid data', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        await expect(managerApp.getDeviceInfo()).rejects.toThrow(
          testCase.errorInstance,
        );

        expectMockCalls(testCase);
      });
    });
  });
});
