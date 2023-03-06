import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach } from '@jest/globals';
import { sendData } from '../sendData';
import { legacySendDataTestCases } from '../__fixtures__/sendData';

describe('Legacy Operations: sendData', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
    await connection.beforeOperation();
  });

  afterEach(async () => {
    await connection.afterOperation();
  });

  test('should be able to send data', async () => {
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

    for (const testCase of legacySendDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await sendData(
        connection,
        testCase.command,
        testCase.data,
        testCase.version,
        testCase.maxTries,
      );

      await connection.destroy();
    }
  });

  test('should be able to handle multiple retries', async () => {
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
          Math.random() < 0.5 &&
          currentRetry < maxTries &&
          totalTimeoutTriggers < maxTimeoutTriggers;

        if (!doTriggerError) {
          await connection.mockDeviceSend(testCase.ackPackets[packetIndex]);
        } else {
          totalTimeoutTriggers += 1;
          retries[packetIndex] = currentRetry;
        }
      };

    for (const testCase of legacySendDataTestCases.valid) {
      retries = {};
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await sendData(
        connection,
        testCase.command,
        testCase.data,
        testCase.version,
        maxTries,
      );

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    expect.assertions(legacySendDataTestCases.valid.length);
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

    for (const testCase of legacySendDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));

      await connection.destroy();
      await sendData(
        connection,
        testCase.command,
        testCase.data,
        testCase.version,
        testCase.maxTries,
      ).catch(error => {
        expect(error).toBeInstanceOf(DeviceConnectionError);
      });
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    expect.assertions(legacySendDataTestCases.valid.length);
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

    for (const testCase of legacySendDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));

      await connection.destroy();
      await sendData(
        connection,
        testCase.command,
        testCase.data,
        testCase.version,
        testCase.maxTries,
      ).catch(error => {
        expect(error).toBeInstanceOf(DeviceConnectionError);
      });
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of legacySendDataTestCases.invalidArgs) {
      await expect(
        sendData(
          connection,
          testCase.command as any,
          testCase.data as any,
          testCase.version as any,
          testCase.maxTries as any,
        ),
      ).rejects.toThrow();
    }
  });
});
