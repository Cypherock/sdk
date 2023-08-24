import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import fixtures from './__fixtures__';
import { clearMocks, expectMockCalls, setupMocks } from './__helpers__';

import { ITrainCardParams, ManagerApp } from '../../src/index';

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
        const onEvent = setupMocks(testCase);

        const onWallets: ITrainCardParams['onWallets'] = jest.fn(
          async params => {
            expect(params).toEqual(testCase.output);

            return testCase.isSelfCreated ?? false;
          },
        );

        const output = await managerApp.trainCard({ onWallets, onEvent });

        expect(output).toEqual(testCase.output);
        if ((testCase.output?.walletList?.length ?? 0) > 0) {
          expect(onWallets).toBeCalled();
        }
        expectMockCalls(testCase);
      });
    });
  });

  describe('should throw error when device returns invalid data', () => {
    fixtures.invalidData.forEach(testCase => {
      test(testCase.name, async () => {
        const onEvent = setupMocks(testCase);

        const onWallets: ITrainCardParams['onWallets'] = jest.fn(
          async params => {
            expect(params).toEqual(testCase.result);

            return testCase.isSelfCreated ?? false;
          },
        );

        const rejectedPromise = managerApp.trainCard({ onWallets, onEvent });

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
        const onEvent = setupMocks(testCase);

        const onWallets: ITrainCardParams['onWallets'] = jest.fn(
          async params => {
            expect(params).toEqual(testCase.result);

            return testCase.isSelfCreated ?? false;
          },
        );
        const rejectedPromise = managerApp.trainCard({ onWallets, onEvent });

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
