import {
  DeviceBootloaderError,
  DeviceConnectionError,
  DeviceState,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';
import { SDK } from '../../src';
import { config } from '../__fixtures__/config';
import fixtures from './__fixtures__/sendBootloaderData';

describe('sdk.sendBootloaderData', () => {
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
    await sdk.destroy();
  });

  describe('should be able to send data', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          await connection.mockDeviceSend(new Uint8Array([6]));
        };

        connection.configureListeners(onData);

        // Set in receiving mode
        await connection.mockDeviceSend(new Uint8Array([67]));
        await sdk.sendBootloaderData(testCase.data, undefined, {
          maxTries: 1,
          firstTimeout: config.defaultTimeout,
          timeout: config.defaultTimeout,
        });
      });
    });
  });

  describe('should be able to handle multiple retries', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const maxTimeoutTriggers = 3;
        let totalTimeoutTriggers = 0;

        const maxTries = 3;
        const retries: Record<number, number | undefined> = {};

        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          const currentRetry = (retries[packetIndex] ?? 0) + 1;

          const doTriggerError =
            Math.random() < 0.5 &&
            currentRetry < maxTries &&
            totalTimeoutTriggers < maxTimeoutTriggers;

          if (!doTriggerError) {
            await connection.mockDeviceSend(new Uint8Array([6]));
          } else {
            totalTimeoutTriggers += 1;
            retries[packetIndex] = currentRetry;
          }
        };

        connection.configureListeners(onData);

        await connection.mockDeviceSend(new Uint8Array([67]));
        await sdk.sendBootloaderData(testCase.data, undefined, {
          timeout: config.defaultTimeout,
          firstTimeout: config.defaultTimeout,
          maxTries,
        });
      });
    });
  });

  describe('should return valid errors when device is not in receiving mode', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = jest.fn();

        connection.configureListeners(onData);

        await expect(
          sdk.sendBootloaderData(testCase.data, undefined, {
            timeout: config.defaultTimeout,
            firstTimeout: config.defaultTimeout,
            maxTries: 1,
          }),
        ).rejects.toThrow(DeviceBootloaderError);
        expect(onData.mock.calls).toHaveLength(0);
      });
    });
  });

  describe('should return valid errors when device is disconnected', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = jest.fn();

        connection.configureListeners(onData);

        // Set in receiving mode
        await connection.mockDeviceSend(new Uint8Array([67]));
        await connection.destroy();

        await expect(
          sdk.sendBootloaderData(testCase.data, undefined, {
            timeout: config.defaultTimeout,
            firstTimeout: config.defaultTimeout,
            maxTries: 1,
          }),
        ).rejects.toThrow(DeviceConnectionError);
        expect(onData.mock.calls).toHaveLength(0);
      });
    });
  });

  describe('should return valid errors when device is disconnected in between', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          if (packetIndex >= testCase.packets.length - 1) {
            await connection.destroy();
          } else {
            await connection.mockDeviceSend(new Uint8Array([6]));
          }
        };

        connection.configureListeners(onData);

        // Set in receiving mode
        await connection.mockDeviceSend(new Uint8Array([67]));

        await expect(
          sdk.sendBootloaderData(testCase.data, undefined, {
            timeout: config.defaultTimeout,
            firstTimeout: config.defaultTimeout,
            maxTries: 1,
          }),
        ).rejects.toThrow(DeviceConnectionError);
      });
    });
  });

  describe('should throw error with invalid arguments', () => {
    fixtures.invalidArgs.forEach(testCase => {
      test(
        JSON.stringify(testCase),
        async () => {
          await expect(
            sdk.sendBootloaderData(testCase.data as any),
          ).rejects.toThrow();
        },
        200,
      );
    });
  });
});
