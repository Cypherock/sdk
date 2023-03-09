import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach } from '@jest/globals';
import { sendBootloaderAbort } from '../sendBootloaderAbort';
import { sendBootloaderAbortTestCases } from '../__fixtures__/sendBootloaderAbort';

describe('Bootloader Operations: sendBootloaderAbort', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
    await connection.beforeOperation();
  });

  afterEach(async () => {
    await connection.afterOperation();
  });

  test('should be able to send abort', async () => {
    expect.assertions(1);

    const onData = async (data: Uint8Array) => {
      expect(data).toEqual(new Uint8Array([65]));
      await connection.mockDeviceSend(new Uint8Array([24]));
    };

    connection.removeListeners();

    connection.configureListeners(onData);
    await sendBootloaderAbort(connection, 1);

    await connection.destroy();
  });

  test('should be able to handle multiple retries', async () => {
    const maxTries = 3;
    let currentRetry = 0;

    expect.assertions(maxTries);

    const onData = async (data: Uint8Array) => {
      expect(data).toEqual(new Uint8Array([65]));
      currentRetry += 1;
      if (currentRetry >= maxTries) {
        await connection.mockDeviceSend(new Uint8Array([24]));
      }
    };

    connection.removeListeners();

    connection.configureListeners(onData);
    await sendBootloaderAbort(connection, maxTries, { firstTimeout: 2000 });

    await connection.destroy();
  });

  test('should return valid errors when device is disconnected', async () => {
    expect.assertions(1);
    const onData = async (data: Uint8Array) => {
      expect(data).toEqual(new Uint8Array([65]));
      await connection.mockDeviceSend(new Uint8Array([24]));
    };

    connection.removeListeners();

    connection.configureListeners(onData);
    await connection.destroy();
    await expect(sendBootloaderAbort(connection, 1)).rejects.toThrow(
      DeviceConnectionError,
    );
  });

  test('should return valid errors when device is disconnected in between', async () => {
    expect.assertions(2);
    const onData = async (data: Uint8Array) => {
      expect(data).toEqual(new Uint8Array([65]));
      await connection.destroy();
    };

    connection.removeListeners();

    connection.configureListeners(onData);
    await expect(sendBootloaderAbort(connection, 1)).rejects.toThrow(
      DeviceConnectionError,
    );
    await connection.destroy();
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of sendBootloaderAbortTestCases.invalidArgs) {
      const params = {
        connection: testCase.connection as any,
      };

      if (!Object.prototype.hasOwnProperty.call(testCase, 'connection')) {
        params.connection = connection;
      }

      await expect(sendBootloaderAbort(params.connection)).rejects.toThrow();
    }
  });
});
