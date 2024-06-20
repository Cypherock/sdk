import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';

import * as sdkMocks from '../../src/__mocks__/sdk';
import { setTronWeb, TronApp } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const TronWeb = require('tronweb');

describe('TronApp.create', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
    setTronWeb(new TronWeb({ fullHost: 'https://api.trongrid.io' }));
    sdkMocks.create.mockClear();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  test('should be able to create tron app instance', async () => {
    await TronApp.create(connection);

    expect(sdkMocks.create).toHaveBeenCalledTimes(1);
    expect(sdkMocks.create.mock.lastCall).toContainEqual(connection);
  });
});
