import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { SDK } from '../src/index';
import { config } from './__fixtures__/config';
import fixtures from './__fixtures__/create';

describe('SDK.create', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  describe('should be able to create SDK instance', () => {
    fixtures.valid.forEach(testCase => {
      test(JSON.stringify(testCase.output), async () => {
        const onData = async (data: Uint8Array) => {
          expect(testCase.packet).toEqual(data);
          for (const ackPacket of testCase.ackPackets) {
            await connection.mockDeviceSend(ackPacket);
          }
        };

        connection.configureListeners(onData);
        const sdk = await SDK.create(connection, 0, {
          maxTries: 1,
          timeout: config.defaultTimeout,
        });

        expect(sdk.getVersion()).toEqual(testCase.output.sdkVersion);
        expect(sdk.getPacketVersion()).toEqual(testCase.output.packetVersion);
        expect(sdk.isInBootloader()).resolves.toEqual(testCase.isInBootloader);
        expect(sdk.deprecated.isLegacyOperationSupported()).resolves.toEqual(
          testCase.isLegacyOperationSupported,
        );
        expect(sdk.deprecated.isRawOperationSupported()).resolves.toEqual(
          testCase.isRawOperationSupported,
        );
        expect(sdk.isSupported()).resolves.toEqual(
          testCase.isProtoOperationSupported,
        );
      });
    });
  });

  describe('should be able to get sequeneNumbers', () => {
    fixtures.valid.forEach(testCase => {
      test(JSON.stringify(testCase.output), async () => {
        const onData = async (data: Uint8Array) => {
          expect(testCase.packet).toEqual(data);
          for (const ackPacket of testCase.ackPackets) {
            await connection.mockDeviceSend(ackPacket);
          }
        };

        connection.configureListeners(onData);
        const sdk = await SDK.create(connection, 0, {
          maxTries: 1,
          timeout: config.defaultTimeout,
        });

        expect(sdk.getVersion()).toEqual(testCase.output.sdkVersion);
        expect(sdk.getPacketVersion()).toEqual(testCase.output.packetVersion);
        expect(sdk.isInBootloader()).resolves.toEqual(testCase.isInBootloader);
        expect(sdk.deprecated.isLegacyOperationSupported()).resolves.toEqual(
          testCase.isLegacyOperationSupported,
        );
        expect(sdk.deprecated.isRawOperationSupported()).resolves.toEqual(
          testCase.isRawOperationSupported,
        );
        expect(sdk.isSupported()).resolves.toEqual(
          testCase.isProtoOperationSupported,
        );

        for (let i = 0; i < 100; i += 1) {
          expect(sdk.getSequenceNumber()).resolves.toEqual(i);
          expect(sdk.getNewSequenceNumber()).resolves.toEqual(i + 1);
        }
      });
    });
  });

  describe('should be able to handle multiple retries', () => {
    fixtures.valid.forEach(testCase => {
      test(JSON.stringify(testCase.output), async () => {
        const maxTimeoutTriggers = 2;
        let totalTimeoutTriggers = 0;

        const maxTries = 2;
        let retries = 0;

        const onData = async (data: Uint8Array) => {
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

        connection.configureListeners(onData);
        const sdk = await SDK.create(connection, 0, {
          maxTries,
          timeout: config.defaultTimeout,
        });

        expect(sdk.getVersion()).toEqual(testCase.output.sdkVersion);
        expect(sdk.getPacketVersion()).toEqual(testCase.output.packetVersion);
        expect(sdk.isInBootloader()).resolves.toEqual(testCase.isInBootloader);
        expect(sdk.deprecated.isLegacyOperationSupported()).resolves.toEqual(
          testCase.isLegacyOperationSupported,
        );
        expect(sdk.deprecated.isRawOperationSupported()).resolves.toEqual(
          testCase.isRawOperationSupported,
        );
        expect(sdk.isSupported()).resolves.toEqual(
          testCase.isProtoOperationSupported,
        );
      });
    });
  });

  describe('should throw error when device is disconnected', () => {
    fixtures.valid.forEach(testCase => {
      test(JSON.stringify(testCase.output), async () => {
        const onData = async (data: Uint8Array) => {
          expect(testCase.packet).toEqual(data);
          for (const ackPacket of testCase.ackPackets) {
            await connection.mockDeviceSend(ackPacket);
          }
        };

        connection.configureListeners(onData);
        await connection.destroy();
        await expect(
          SDK.create(connection, 0, {
            maxTries: 1,
            timeout: config.defaultTimeout,
          }),
        ).rejects.toThrow(DeviceConnectionError);
      });
    });
  });

  describe('should throw error when device is disconnected in between', () => {
    fixtures.valid.forEach(testCase => {
      test(JSON.stringify(testCase.output), async () => {
        const onData = async (data: Uint8Array) => {
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

        connection.configureListeners(onData);
        await expect(
          SDK.create(connection, 0, {
            maxTries: 1,
            timeout: config.defaultTimeout,
          }),
        ).rejects.toThrow(DeviceConnectionError);
      });
    });
  });
});
