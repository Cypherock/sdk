import { expect } from '@jest/globals';

import * as sdkMocks from '../../../src/__mocks__/sdk';
import { IGetDeviceInfoTestCase } from '../__fixtures__/types';

export function setupMocks(testCase: IGetDeviceInfoTestCase) {
  sdkMocks.sendQuery.mockReturnValueOnce(Promise.resolve(undefined));

  sdkMocks.waitForResult.mockReturnValueOnce(Promise.resolve(testCase.result));
}

export function clearMocks() {
  sdkMocks.create.mockClear();

  sdkMocks.sendQuery.mockReset();
  sdkMocks.waitForResult.mockReset();

  sdkMocks.runOperation.mockClear();
}

export function expectMockCalls(testCase: IGetDeviceInfoTestCase) {
  expect(sdkMocks.runOperation).toHaveBeenCalledTimes(1);
  expect(sdkMocks.sendQuery.mock.calls).toEqual([[testCase.query]]);
}
