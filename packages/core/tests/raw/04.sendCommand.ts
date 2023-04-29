import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import {
  describe,
  test,
  expect,
  afterEach,
  jest,
  beforeEach,
} from '@jest/globals';
import { SDK } from '../../src';
import { config } from '../__fixtures__/config';
import fixtures from './__fixtures__/sendCommand';

describe('sdk.deprecated.sendCommand', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() => fixtures.constantDate.getTime());

    connection = await MockDeviceConnection.create();

    const onData = async () => {
      // SDK Version: 2.7.1, Packet Version: v3
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 2, 0,
          7, 0, 1, 130, 112,
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

  describe('should be able to send command', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          for (const ackPacket of testCase.ackPackets[packetIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }
        };

        connection.configureListeners(onData);
        await sdk.deprecated.sendCommand({
          data: testCase.data,
          commandType: testCase.commandType,
          sequenceNumber: testCase.sequenceNumber,
          maxTries: 1,
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
            for (const ackPacket of testCase.ackPackets[packetIndex]) {
              await connection.mockDeviceSend(ackPacket);
            }
          } else {
            totalTimeoutTriggers += 1;
            retries[packetIndex] = currentRetry;
          }
        };

        connection.configureListeners(onData);
        await sdk.deprecated.sendCommand({
          data: testCase.data,
          commandType: testCase.commandType,
          sequenceNumber: testCase.sequenceNumber,
          maxTries,
          timeout: config.defaultTimeout,
        });
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
          sdk.deprecated.sendCommand({
            data: testCase.data,
            commandType: testCase.commandType,
            sequenceNumber: testCase.sequenceNumber,
            maxTries: 1,
            timeout: config.defaultTimeout,
          }),
        ).rejects.toThrow(DeviceConnectionError);
        expect(onData.mock.calls).toHaveLength(0);
      });
    });
  });

  describe('should throw error when device is disconnected in between', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);

          let i = 0;
          for (const ackPacket of testCase.ackPackets[packetIndex]) {
            if (i >= testCase.ackPackets[packetIndex].length - 1) {
              await connection.destroy();
            } else {
              await connection.mockDeviceSend(ackPacket);
            }
            i += 1;
          }
        };

        connection.configureListeners(onData);
        await expect(
          sdk.deprecated.sendCommand({
            data: testCase.data,
            commandType: testCase.commandType,
            sequenceNumber: testCase.sequenceNumber,
            maxTries: 1,
            timeout: config.defaultTimeout,
          }),
        ).rejects.toThrow(DeviceConnectionError);
      });
    });
  });

  describe('should throw error when device sends invalid data', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = async (data: Uint8Array) => {
          const packetIndex = testCase.packets.findIndex(
            elem => elem.toString() === data.toString(),
          );
          expect(testCase.packets).toContainEqual(data);
          expect(packetIndex).toBeGreaterThanOrEqual(0);
          for (const ackPacket of testCase.ackPackets[packetIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }
        };

        connection.configureListeners(onData);
        await expect(
          sdk.deprecated.sendCommand({
            data: testCase.data as any,
            commandType: testCase.commandType as any,
            sequenceNumber: testCase.sequenceNumber as any,
            maxTries: 1,
            timeout: config.defaultTimeout,
          }),
        ).rejects.toBeInstanceOf(testCase.errorInstance);
      });
    });
  });

  describe('should throw error with invalid arguments', () => {
    fixtures.invalidArgs.forEach(testCase => {
      test(
        JSON.stringify(testCase),
        async () => {
          await expect(
            sdk.deprecated.sendCommand({
              data: testCase.data as any,
              commandType: testCase.commandType as any,
              sequenceNumber: testCase.sequenceNumber as any,
              maxTries: 1,
              timeout: config.defaultTimeout,
            }),
          ).rejects.toBeInstanceOf(Error);
        },
        200,
      );
    });
  });
});
