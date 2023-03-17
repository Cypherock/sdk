import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import * as sdkMocks from './__mocks__/sdk';
import { ManagerApp } from '../src/index';
import fixtures from './__fixtures__/authDevice';

describe('managerApp.authDevice', () => {
  let connection: MockDeviceConnection;
  let managerApp: ManagerApp;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
    sdkMocks.create.mockClear();

    sdkMocks.sendQuery.mockReset();
    sdkMocks.waitForResult.mockReset();

    sdkMocks.runOperation.mockClear();

    managerApp = await ManagerApp.create(connection);
  });

  afterEach(async () => {
    await managerApp.destroy();
  });

  describe('should be able perform device auth', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        testCase.queries.forEach(query => {
          sdkMocks.sendQuery.mockImplementationOnce(async (params: any) => {
            expect(params).toBeDefined();
            expect(params.data).toEqual(query.data);
            return undefined;
          });
        });

        testCase.results.forEach(result => {
          sdkMocks.waitForResult.mockImplementationOnce(
            async () => result.data,
          );
        });

        const output = await managerApp.authDevice();

        expect(output).toEqual(testCase.output);
        expect(sdkMocks.runOperation).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('should throw error when device returns invalid data', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        testCase.queries.forEach(query => {
          sdkMocks.sendQuery.mockImplementationOnce(async (params: any) => {
            expect(params).toBeDefined();
            expect(params.data).toEqual(query.data);
            return undefined;
          });
        });

        testCase.results.forEach(result => {
          sdkMocks.waitForResult.mockImplementationOnce(
            async () => result.data,
          );
        });

        await expect(managerApp.authDevice()).rejects.toThrow(
          testCase.errorInstance,
        );
      });
    });
  });
});
