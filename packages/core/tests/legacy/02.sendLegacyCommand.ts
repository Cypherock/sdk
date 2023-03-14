import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, test, expect, afterEach, beforeEach } from '@jest/globals';
import SDK from '../../src';
import fixtures from './__fixtures__/sendLegacyCommand';

describe('sdk.sendLegacyCommand', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  let appletId = 0;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();

    const getOnData = async () => {
      // SDK Version: 0.1.16, PacketVersion: v1
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 0, 0,
          1, 0, 16, 118, 67,
        ]),
      );
    };
    connection.configureListeners(getOnData);

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
        const getOnData =
          (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[] }) =>
          async (data: Uint8Array) => {
            const packetIndex = testCase.packets.findIndex(
              elem => elem.toString() === data.toString(),
            );
            expect(testCase.packets).toContainEqual(data);
            expect(packetIndex).toBeGreaterThanOrEqual(0);
            await connection.mockDeviceSend(testCase.ackPackets[packetIndex]);
          };

        connection.configureListeners(getOnData(testCase));
        await sdk.sendLegacyCommand(
          testCase.params.command,
          testCase.params.data,
          1,
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
        let retries: Record<number, number | undefined> = {};

        const getOnData =
          (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[] }) =>
          async (data: Uint8Array) => {
            const packetIndex = testCase.packets.findIndex(
              elem => elem.toString() === data.toString(),
            );
            expect(testCase.packets).toContainEqual(data);
            expect(packetIndex).toBeGreaterThanOrEqual(0);

            const currentRetry = (retries[packetIndex] ?? 0) + 1;

            const doTriggerError =
              true &&
              currentRetry < maxTries &&
              totalTimeoutTriggers < maxTimeoutTriggers;

            if (!doTriggerError) {
              await connection.mockDeviceSend(testCase.ackPackets[packetIndex]);
            } else {
              totalTimeoutTriggers += 1;
              retries[packetIndex] = currentRetry;
            }
          };

        connection.configureListeners(getOnData(testCase));
        await sdk.sendLegacyCommand(
          testCase.params.command,
          testCase.params.data,
          maxTries,
        );

        await connection.destroy();
      });
    });
  });

  describe('should return valid errors when device is disconnected', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(1);
        const getOnData = () => async (data: Uint8Array) => {
          expect(data).toEqual(undefined);
        };

        connection.configureListeners(getOnData());

        await connection.destroy();
        await sdk
          .sendLegacyCommand(testCase.params.command, testCase.params.data, 1)
          .catch(error => {
            expect(error).toBeInstanceOf(DeviceConnectionError);
          });
      });
    });
  });

  describe('should return valid errors when device is disconnected in between', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(1);
        const getOnData =
          (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[] }) =>
          async (data: Uint8Array) => {
            const packetIndex = testCase.packets.findIndex(
              elem => elem.toString() === data.toString(),
            );
            if (packetIndex >= testCase.ackPackets.length - 1) {
              await connection.destroy();
            }
            await connection.mockDeviceSend(testCase.ackPackets[packetIndex]);
          };

        connection.configureListeners(getOnData(testCase));

        await connection.destroy();
        await sdk
          .sendLegacyCommand(testCase.params.command, testCase.params.data, 1)
          .catch(error => {
            expect(error).toBeInstanceOf(DeviceConnectionError);
          });
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
          sdk.sendLegacyCommand(params.command, params.data, params.maxTries),
        ).rejects.toThrow();
      });
    });
  });
});
