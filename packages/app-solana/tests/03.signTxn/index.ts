import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import * as solanaWeb3 from '@solana/web3.js';

import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';
import fixtures from './__fixtures__';

import { SolanaApp, setSolanaWeb3 } from '../../src/index';

describe('solanaApp.signTxn', () => {
  let connection: MockDeviceConnection;
  let solanaApp: SolanaApp;

  beforeEach(async () => {
    clearMocks();

    connection = await MockDeviceConnection.create();
    solanaApp = await SolanaApp.create(connection);
    setSolanaWeb3(solanaWeb3);
  });

  afterEach(async () => {
    await solanaApp.destroy();
  });

  describe('should be able to get signature', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onEvent = setupMocks(testCase);

        const output = await solanaApp.signTxn({
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

        const rejectedPromise = solanaApp.signTxn(testCase.params);

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

        const rejectedPromise = solanaApp.signTxn(testCase.params);

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

        const rejectedPromise = solanaApp.signTxn(testCase.params);

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
