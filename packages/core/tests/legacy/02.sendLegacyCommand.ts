import {
  DeviceConnectionError,
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
import fixtures from './__fixtures__/sendLegacyCommand';

describe('sdk.deprecated.sendLegacyCommand', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();

    const onData = async () => {
      // SDK Version: 0.1.16, PacketVersion: v1
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 0, 0,
          1, 0, 16, 118, 67,
        ]),
      );
    };
    connection.configureListeners(onData);

    sdk = await SDK.create(connection, appletId);
    await sdk.beforeOperation();

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
          await connection.mockDeviceSend(testCase.ackPackets[packetIndex]);
        };

        connection.configureListeners(onData);
        await sdk.deprecated.sendLegacyCommand(
          testCase.params.command,
          testCase.params.data,
          1,
          config.defaultTimeout,
        );
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
            Math.random() > 0.5 &&
            currentRetry < maxTries &&
            totalTimeoutTriggers < maxTimeoutTriggers;

          if (!doTriggerError) {
            await connection.mockDeviceSend(testCase.ackPackets[packetIndex]);
          } else {
            totalTimeoutTriggers += 1;
            retries[packetIndex] = currentRetry;
          }
        };

        connection.configureListeners(onData);
        await sdk.deprecated.sendLegacyCommand(
          testCase.params.command,
          testCase.params.data,
          maxTries,
          config.defaultTimeout,
        );
      });
    });
  });

  describe('should throw error when device is disconnected', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(2);
        const onData = jest.fn();

        connection.configureListeners(onData);

        await connection.destroy();

        await expect(
          sdk.deprecated.sendLegacyCommand(
            testCase.params.command,
            testCase.params.data,
            1,
            config.defaultTimeout,
          ),
        ).rejects.toThrow(DeviceConnectionError);
        expect(onData.mock.calls).toHaveLength(0);
      });
    });
  });

  describe('should throw error when device is disconnected in between', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(1);
        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          if (packetIndex >= testCase.ackPackets.length - 1) {
            await connection.destroy();
          }
          await connection.mockDeviceSend(testCase.ackPackets[packetIndex]);
        };

        connection.configureListeners(onData);

        await expect(
          sdk.deprecated.sendLegacyCommand(
            testCase.params.command,
            testCase.params.data,
            1,
            config.defaultTimeout,
          ),
        ).rejects.toThrow(DeviceConnectionError);
      });
    });
  });

  describe('should throw error with invalid arguments', () => {
    fixtures.invalidArgs.forEach(testCase => {
      test(JSON.stringify(testCase), async () => {
        const params = {
          command: testCase.command as any,
          data: testCase.data as any,
          maxTries: testCase.maxTries as any,
        };

        await expect(
          sdk.deprecated.sendLegacyCommand(
            params.command,
            params.data,
            params.maxTries,
            config.defaultTimeout,
          ),
        ).rejects.toThrow();
      });
    }, 200);
  });
});
