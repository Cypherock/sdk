import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import * as bitcoinJsLib from 'bitcoinjs-lib';
import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';
import fixtures from './__fixtures__';

import { BtcApp, setBitcoinJSLib } from '../../src/index';

describe('btcApp.signTxn', () => {
  let connection: MockDeviceConnection;
  let btcApp: BtcApp;

  beforeEach(async () => {
    clearMocks();

    connection = await MockDeviceConnection.create();
    btcApp = await BtcApp.create(connection);
    setBitcoinJSLib(bitcoinJsLib);
  });

  afterEach(async () => {
    await btcApp.destroy();
  });

  describe('should be able to sign txn', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onEvent = setupMocks(testCase);

        const output = await btcApp.signTxn({
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

        const rejectedPromise = btcApp.signTxn(testCase.params);

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

        const rejectedPromise = btcApp.signTxn(testCase.params);

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

        const rejectedPromise = btcApp.signTxn(testCase.params);

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
