import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';
import fixtures from './__fixtures__';

import { InheritanceApp } from '../../src/index';

describe('InheritanceApp.decryptMessagesWithPin', () => {
  let connection: MockDeviceConnection;
  let inheritanceApp: InheritanceApp;

  beforeEach(async () => {
    clearMocks();

    connection = await MockDeviceConnection.create();
    inheritanceApp = await InheritanceApp.create(connection);
  });

  afterEach(async () => {
    await inheritanceApp.destroy();
  });

  describe('should be able to decrypt messages', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const output = await inheritanceApp.decryptMessagesWithPin({
          ...testCase.params,
        });
        expect(output).toEqual(testCase.output);

        expectMockCalls(testCase);
      });
    });
  });

  describe('should throw error with invalid arguments', () => {
    fixtures.invalidArgs.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const rejectedPromise = inheritanceApp.decryptMessagesWithPin(
          testCase.params,
        );

        await expect(rejectedPromise).rejects.toThrow(testCase.errorInstance);
        if (testCase.errorMessage) {
          try {
            await rejectedPromise;
          } catch (error: any) {
            expect(error.message).toMatch(testCase.errorMessage);
          }
        }
      });
    });
  });

  describe('should throw error when device returns error', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const rejectedPromise = inheritanceApp.decryptMessagesWithPin(
          testCase.params,
        );

        await expect(rejectedPromise).rejects.toThrow(testCase.errorInstance);
        if (testCase.errorMessage) {
          try {
            await rejectedPromise;
          } catch (error: any) {
            expect(error.message).toMatch(testCase.errorMessage);
          }
        }

        expectMockCalls(testCase);
      });
    });
  });
});
