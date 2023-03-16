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
import fixtures from './__fixtures__/sendCommandAbort';

describe('sdk.deprecated.sendCommandAbort', () => {
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

  describe('should be able to send abort', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = async (data: Uint8Array) => {
          expect(testCase.abortRequest).toEqual(data);
          for (const ackPacket of testCase.ackPackets) {
            await connection.mockDeviceSend(ackPacket);
          }
        };

        connection.configureListeners(onData);
        const status = await sdk.deprecated.sendCommandAbort(
          testCase.sequenceNumber,
          1,
          config.defaultTimeout,
        );

        expect(status).toEqual(testCase.status);
      });
    });
  });

  describe('should be able to handle multiple retries', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const maxTries = 3;
        let retries = 0;

        const onData = async () => {
          const currentRetry = retries + 1;

          const doTriggerError = Math.random() > 0.5 && currentRetry < maxTries;

          if (!doTriggerError) {
            for (const ackPacket of testCase.ackPackets) {
              await connection.mockDeviceSend(ackPacket);
            }
          } else {
            retries = currentRetry;
          }
        };

        connection.configureListeners(onData);
        const status = await sdk.deprecated.sendCommandAbort(
          testCase.sequenceNumber,
          maxTries,
          config.defaultTimeout,
        );

        expect(status).toEqual(testCase.status);
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
          sdk.deprecated.sendCommandAbort(
            testCase.sequenceNumber,
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
        const onData = async (data: Uint8Array) => {
          expect(testCase.abortRequest).toEqual(data);
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
          sdk.deprecated.sendCommandAbort(
            testCase.sequenceNumber,
            1,
            config.defaultTimeout,
          ),
        ).rejects.toThrow(DeviceConnectionError);
      });
    });
  });

  describe('should throw error when device sends invalid data', () => {
    fixtures.error.forEach(testCase => {
      test(testCase.name, async () => {
        const onData = async (data: Uint8Array) => {
          expect(testCase.abortRequest).toEqual(data);
          for (const ackPacket of testCase.ackPackets) {
            await connection.mockDeviceSend(ackPacket);
          }
        };

        connection.configureListeners(onData);
        await expect(
          sdk.deprecated.sendCommandAbort(
            testCase.sequenceNumber,
            1,
            config.defaultTimeout,
          ),
        ).rejects.toBeInstanceOf(testCase.errorInstance);
      });
    });
  });

  describe('should throw error with invalid arguments', () => {
    fixtures.invalidArgs.forEach(testCase => {
      test(JSON.stringify(testCase), async () => {
        await expect(
          sdk.deprecated.sendCommandAbort(
            testCase.sequenceNumber as any,
            1,
            config.defaultTimeout,
          ),
        ).rejects.toBeInstanceOf(Error);
      });
    }, 200);
  });
});
