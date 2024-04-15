import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import * as sdkMocks from '../../src/__mocks__/sdk';
import { BittensorApp } from '../../src/index';

describe('BittensorApp.create', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
    sdkMocks.create.mockClear();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  test('should be able to create bittensor app instance', async () => {
    await BittensorApp.create(connection);

    expect(sdkMocks.create).toHaveBeenCalledTimes(1);
    expect(sdkMocks.create.mock.lastCall).toContainEqual(connection);
  });
});
