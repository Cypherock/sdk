import { MockDeviceConnection } from '@cypherock/sdk-interfaces';
import {
  describe,
  test,
  expect,
  afterEach,
  jest,
  beforeEach,
} from '@jest/globals';
import { expectMockCalls, setupMocks } from './__helpers__';
import { SDK } from '../../src';
import fixtures from './__fixtures__/startSession';

describe('sdk.startSession', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() => fixtures.constantDate.getTime());

    connection = await MockDeviceConnection.create();

    const onData = async () => {
      // SDK Version: 3.0.1, Packet Version: v3
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 3, 0,
          0, 0, 1, 173, 177,
        ]),
      );
    };
    connection.configureListeners(onData);

    sdk = await SDK.create(connection, appletId);
    await sdk.beforeOperation();

    connection.removeListeners();
  });

  afterEach(async () => {
    global.Date.now = RealDate;
    await connection.destroy();
  });

  describe('should be able to start session', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        setupMocks(testCase);

        const output = await sdk.startSession();

        expect(output).toEqual(testCase.output);
        expectMockCalls(testCase);
      });
    });
  });
});
