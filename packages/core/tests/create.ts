import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { SDK } from '../src/index';
import fixtures from './__fixtures__/create';

describe('SDK.create', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  test('should be able to create SDK instance', async () => {
    const getOnData =
      (testCase: { packet: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.packet).toEqual(data);
        for (const ackPacket of testCase.ackPackets) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of fixtures.valid) {
      connection = await MockDeviceConnection.create();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const sdk = await SDK.create(connection, 0);

      expect(sdk.getVersion()).toEqual(testCase.output.sdkVersion);
      expect(sdk.getPacketVersion()).toEqual(testCase.output.packetVersion);
      expect(sdk.isSupported()).toEqual(testCase.isSupported);
      expect(sdk.isSDKNewer()).toEqual(testCase.isNewer);

      await connection.destroy();
    }
  });

  test('should be able to get sequeneNumbers', async () => {
    const getOnData =
      (testCase: { packet: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.packet).toEqual(data);
        for (const ackPacket of testCase.ackPackets) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of fixtures.valid) {
      connection = await MockDeviceConnection.create();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const sdk = await SDK.create(connection, 0);

      expect(sdk.getVersion()).toEqual(testCase.output.sdkVersion);
      expect(sdk.getPacketVersion()).toEqual(testCase.output.packetVersion);
      expect(sdk.isSupported()).toEqual(testCase.isSupported);
      expect(sdk.isSDKNewer()).toEqual(testCase.isNewer);

      for (let i = 0; i < 100; i += 1) {
        expect(sdk.getSequenceNumber()).toEqual(i);
        expect(sdk.getNewSequenceNumber()).toEqual(i + 1);
      }

      await connection.destroy();
    }
  });

  test('should be able to handle multiple retries', async () => {
    const maxTimeoutTriggers = 2;
    let totalTimeoutTriggers = 0;

    const maxTries = 2;
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

    for (const testCase of fixtures.valid) {
      retries = 0;
      connection = await MockDeviceConnection.create();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const sdk = await SDK.create(connection, 0);

      expect(sdk.getVersion()).toEqual(testCase.output.sdkVersion);
      expect(sdk.getPacketVersion()).toEqual(testCase.output.packetVersion);
      expect(sdk.isSupported()).toEqual(testCase.isSupported);
      expect(sdk.isSDKNewer()).toEqual(testCase.isNewer);

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

    for (const testCase of fixtures.valid) {
      connection = await MockDeviceConnection.create();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await connection.destroy();
      await expect(SDK.create(connection, 0)).rejects.toThrow(
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

    for (const testCase of fixtures.valid) {
      connection = await MockDeviceConnection.create();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await expect(SDK.create(connection, 0)).rejects.toThrow(
        DeviceConnectionError,
      );

      await connection.destroy();
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of fixtures.invalidArgs) {
      await expect(SDK.getSDKVersion(testCase as any)).rejects.toThrow();
    }
  });
});
