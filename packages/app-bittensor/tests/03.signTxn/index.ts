import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import * as bittensorWeb3 from '@bittensor/web3.js';

import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';
import fixtures from './__fixtures__';

import { BittensorApp, setBittensorWeb3 } from '../../src/index';

describe('bittensorApp.signTxn', () => {
  let connection: MockDeviceConnection;
  let bittensorApp: BittensorApp;

  beforeEach(async () => {
    clearMocks();

    connection = await MockDeviceConnection.create();
    bittensorApp = await BittensorApp.create(connection);
    setBittensorWeb3(bittensorWeb3);
  });

  afterEach(async () => {
    await bittensorApp.destroy();
  });

  describe('should be able to get signature', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onEvent = setupMocks(testCase);

        const output = await bittensorApp.signTxn({
          ...testCase.params,
          onEvent,
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

        const rejectedPromise = bittensorApp.signTxn(testCase.params);

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

  describe('should throw error when device returns invalid data', () => {
    fixtures.invalidData.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const rejectedPromise = bittensorApp.signTxn(testCase.params);

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

  describe('should throw error when device returns error', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const rejectedPromise = bittensorApp.signTxn(testCase.params);

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
