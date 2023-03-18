import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

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
          sdkMocks.sendQuery.mockImplementationOnce(async data => {
            expect(data).toEqual(query.data);
            return undefined;
          });
        });

        const onEvent = jest.fn();
        onEvent.mockClear();

        testCase.results.forEach(result => {
          sdkMocks.waitForResult.mockImplementationOnce(async params => {
            if (params?.onStatus && result.statuses) {
              let onEventCalls = 0;

              for (const status of result.statuses) {
                params.onStatus({ flowStatus: status.flowStatus } as any);

                if (status.expectEventCalls !== undefined) {
                  for (let i = 0; i < status.expectEventCalls.length; i += 1) {
                    const mockIndex =
                      onEvent.mock.calls.length -
                      status.expectEventCalls.length +
                      i;

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

        const output = await managerApp.authDevice(onEvent);

        expect(output).toEqual(testCase.output);
        expect(sdkMocks.runOperation).toHaveBeenCalledTimes(1);
        expect(onEvent.mock.calls).toEqual(testCase.eventCalls);
      });
    });
  });

  describe('should throw error when device returns invalid data', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        testCase.queries.forEach(query => {
          sdkMocks.sendQuery.mockImplementationOnce(async data => {
            expect(data).toEqual(query.data);
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
