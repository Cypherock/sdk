import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, test } from '@jest/globals';
import { SDK } from '../index';
import { getSDKVersionTestCases } from '../__fixtures__/sdk.getSDKVersion';

describe('SDK: getSDKVersion', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  test('should be able to get SDK Version', async () => {
    const getOnData =
      (testCase: { packet: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.packet).toEqual(data);
        for (const ackPacket of testCase.ackPackets) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of getSDKVersionTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const output = await SDK.getSDKVersion(connection, 1);

      expect(output).toEqual(testCase.output);

      await connection.destroy();
    }
  });

  test('should be able to handle multiple retries', async () => {
    const maxTimeoutTriggers = 3;
    let totalTimeoutTriggers = 0;

    const maxTries = 3;
    let retries = 0;

    const getOnData =
      (testCase: { packet: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.packet).toEqual(data);

        const currentRetry = retries + 1;

        const doTriggerError =
          Math.random() < 0.5 &&
          currentRetry < maxTries &&
          totalTimeoutTriggers < maxTimeoutTriggers;

        if (!doTriggerError) {
          for (const ackPacket of testCase.ackPackets) {
            await connection.mockDeviceSend(ackPacket);
          }
        } else {
          totalTimeoutTriggers += 1;
          retries = currentRetry;
        }
      };

    for (const testCase of getSDKVersionTestCases.valid) {
      retries = 0;
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const output = await SDK.getSDKVersion(connection, maxTries, {
        timeout: 500,
      });

      expect(output).toEqual(testCase.output);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    const getOnData =
      (testCase: { packet: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.packet).toEqual(data);
        for (const ackPacket of testCase.ackPackets) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of getSDKVersionTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await connection.destroy();
      await expect(SDK.getSDKVersion(connection, 1)).rejects.toThrow(
        DeviceConnectionError,
      );

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    const getOnData =
      (testCase: { packet: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.packet).toEqual(data);
        let i = 0;
        for (const ackPacket of testCase.ackPackets) {
          if (i >= testCase.ackPackets.length - 1) {
            await connection.destroy();
          } else {
            await connection.mockDeviceSend(ackPacket);
          }
          i += 1;
        }
      };

    for (const testCase of getSDKVersionTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await expect(SDK.getSDKVersion(connection, 1)).rejects.toThrow(
        DeviceConnectionError,
      );

      await connection.destroy();
    }
  });

  test('should be able to valid errors when device returns invalid data', async () => {
    const getOnData =
      (testCase: { packet: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.packet).toEqual(data);
        for (const ackPacket of testCase.ackPackets) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of getSDKVersionTestCases.error) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await expect(SDK.getSDKVersion(connection, 1)).rejects.toThrow(Error);

      await connection.destroy();
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of getSDKVersionTestCases.invalidArgs) {
      await expect(SDK.getSDKVersion(testCase as any)).rejects.toThrow();
    }
  });
});
