import { expect, jest } from '@jest/globals';

import * as sdkMocks from '../../src/__mocks__/sdk';

const onEvent = jest.fn();

export interface ITestCase {
  queries: {
    name: string;
    data: Uint8Array;
  }[];
  results: {
    name: string;
    data: Uint8Array;
    statuses?: { flowStatus: number; expectEventCalls?: number[] }[];
  }[];
  mocks?: {
    eventCalls?: number[][];
  };
}

export function setupMocks(testCase: ITestCase) {
  testCase.queries.forEach(() => {
    sdkMocks.sendQuery.mockReturnValueOnce(Promise.resolve(undefined));
  });

  testCase.results.forEach(result => {
    /*
     * 1. Simulate calling onStatus event for waitForResult
     * 2. Expect the onEvent to be called as described in the testCase
     */
    sdkMocks.waitForResult.mockImplementationOnce(async params => {
      if (params?.onStatus && result.statuses) {
        let onEventCalls = 0;

        for (const status of result.statuses) {
          params.onStatus({ flowStatus: status.flowStatus } as any);

          if (status.expectEventCalls !== undefined) {
            for (let i = 0; i < status.expectEventCalls.length; i += 1) {
              const mockIndex =
                onEvent.mock.calls.length - status.expectEventCalls.length + i;

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

  return onEvent;
}

export function clearMocks() {
  onEvent.mockClear();

  sdkMocks.create.mockClear();

  sdkMocks.sendQuery.mockReset();
  sdkMocks.waitForResult.mockReset();

  sdkMocks.runOperation.mockClear();
}

export function expectMockCalls(testCase: ITestCase) {
  expect(sdkMocks.runOperation).toHaveBeenCalledTimes(1);
  expect(sdkMocks.sendQuery.mock.calls.map(elem => elem[0])).toEqual(
    testCase.queries.map(elem => elem.data),
  );

  if (!testCase.mocks) return;

  if (testCase.mocks.eventCalls) {
    expect(onEvent.mock.calls).toEqual(testCase.mocks.eventCalls);
  }
}
