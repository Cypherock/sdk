import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import fixtures from './__fixtures__';
import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';

import { ManagerApp } from '../../src/index';

describe('managerApp.trainCard', () => {
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

  describe('should be able to complete train card', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const output = await managerApp.trainCard();

        expect(output).toEqual(testCase.output);
        expectMockCalls(testCase);
      });
    });
  });

  describe('should throw error when device returns invalid data', () => {
    fixtures.invalidData.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const rejectedPromise = managerApp.trainCard();

        await expect(rejectedPromise).rejects.toThrow(testCase.errorInstance);
        if (testCase.errorMessage) {
          await expect(rejectedPromise).rejects.toThrowError(
            testCase.errorMessage,
          );
        }

        expectMockCalls(testCase);
      });
    });
  });

  describe('should throw error when device returns error', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const rejectedPromise = managerApp.trainCard();

        await expect(rejectedPromise).rejects.toThrow(testCase.errorInstance);
        if (testCase.errorMessage) {
          await expect(rejectedPromise).rejects.toThrowError(
            testCase.errorMessage,
          );
        }

        expectMockCalls(testCase);
      });
    });
  });
});
