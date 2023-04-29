import {
  DeviceConnectionError,
  DeviceState,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, test, expect, afterEach, beforeEach } from '@jest/globals';
import { SDK } from '../../src';
import { config } from '../__fixtures__/config';

describe('sdk.sendBootloaderAbort', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();

    connection.configureDevice(DeviceState.BOOTLOADER, 'MOCK');

    sdk = await SDK.create(connection, appletId);
    await connection.beforeOperation();

    connection.removeListeners();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  test('should be able to send abort', async () => {
    expect.assertions(1);

    const onData = async (data: Uint8Array) => {
      expect(data).toEqual(new Uint8Array([65]));
      await connection.mockDeviceSend(new Uint8Array([24]));
    };

    connection.configureListeners(onData);
    await sdk.sendBootloaderAbort({ maxTries: 1 });
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

    connection.configureListeners(onData);
    await sdk.sendBootloaderAbort({
      firstTimeout: config.defaultTimeout,
      timeout: config.defaultTimeout,
      maxTries,
    });
  });

  test('should return valid errors when device is disconnected', async () => {
    expect.assertions(1);
    const onData = async (data: Uint8Array) => {
      expect(data).toEqual(new Uint8Array([65]));
      await connection.mockDeviceSend(new Uint8Array([24]));
    };

    connection.configureListeners(onData);
    await connection.destroy();

    await expect(sdk.sendBootloaderAbort({ maxTries: 1 })).rejects.toThrow(
      DeviceConnectionError,
    );
  });

  test('should return valid errors when device is disconnected in between', async () => {
    expect.assertions(2);
    const onData = async (data: Uint8Array) => {
      expect(data).toEqual(new Uint8Array([65]));
      await connection.destroy();
    };

    connection.configureListeners(onData);

    await expect(sdk.sendBootloaderAbort({ maxTries: 1 })).rejects.toThrow(
      DeviceConnectionError,
    );
  });
});
