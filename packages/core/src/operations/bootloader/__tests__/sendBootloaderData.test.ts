import {
  DeviceBootloaderError,
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach } from '@jest/globals';
import { sendBootloaderData } from '../sendBootloaderData';
import { sendBootloaderDataTestCases } from '../__fixtures__/sendBootloaderData';

describe('Bootloader Operations: sendBootloaderData', () => {
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
      (testCase: { packets: Uint8Array[] }) => async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        await connection.mockDeviceSend(new Uint8Array([6]));
      };

    for (const testCase of sendBootloaderDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));

      // Set in receiving mode
      await connection.mockDeviceSend(new Uint8Array([67]));
      await sendBootloaderData(connection, testCase.data, undefined, 1);

      await connection.destroy();
    }
  });

  test('should be able to handle multiple retries', async () => {
    const maxTimeoutTriggers = 3;
    let totalTimeoutTriggers = 0;

    const maxTries = 3;
    let retries: Record<number, number | undefined> = {};

    const getOnData =
      (testCase: { packets: Uint8Array[] }) => async (data: Uint8Array) => {
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

    for (const testCase of sendBootloaderDataTestCases.valid) {
      retries = {};
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));

      // Set in receiving mode
      await connection.mockDeviceSend(new Uint8Array([67]));
      await sendBootloaderData(connection, testCase.data, undefined, maxTries, {
        firstTimeout: 500,
      });

      await connection.destroy();
    }
  });

  test('should return valid errors when device is not in receiving mode', async () => {
    const getOnData =
      (testCase: { packets: Uint8Array[] }) => async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        await connection.mockDeviceSend(new Uint8Array([6]));
      };

    for (const testCase of sendBootloaderDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));

      await expect(
        sendBootloaderData(connection, testCase.data, undefined, 1, {
          timeout: 50,
        }),
      ).rejects.toThrow(DeviceBootloaderError);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    const getOnData =
      (testCase: { packets: Uint8Array[] }) => async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        await connection.mockDeviceSend(new Uint8Array([6]));
      };

    for (const testCase of sendBootloaderDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      // Set in receiving mode
      await connection.mockDeviceSend(new Uint8Array([67]));
      await connection.destroy();

      await expect(
        sendBootloaderData(connection, testCase.data, undefined, 1, {
          timeout: 50,
          firstTimeout: 50,
        }),
      ).rejects.toThrow(DeviceConnectionError);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    const getOnData =
      (testCase: { packets: Uint8Array[] }) => async (data: Uint8Array) => {
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

    for (const testCase of sendBootloaderDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      // Set in receiving mode
      await connection.mockDeviceSend(new Uint8Array([67]));

      await expect(
        sendBootloaderData(connection, testCase.data, undefined, 1, {
          timeout: 500,
          firstTimeout: 500,
        }),
      ).rejects.toThrow(DeviceConnectionError);

      await connection.destroy();
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of sendBootloaderDataTestCases.invalidArgs) {
      const params = {
        connection: testCase.connection as any,
        data: testCase.data as any,
      };

      if (!Object.prototype.hasOwnProperty.call(testCase, 'connection')) {
        params.connection = connection;
      }

      await expect(
        sendBootloaderData(params.connection, params.data),
      ).rejects.toThrow();
    }
  });
});
