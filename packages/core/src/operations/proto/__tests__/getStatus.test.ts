import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach, jest } from '@jest/globals';
import { getStatus } from '../getStatus';
import { rawGetStatusTestCases } from '../__fixtures__/getStatus';

describe('Proto Operations: getStatus', () => {
  let connection: MockDeviceConnection;

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() =>
      rawGetStatusTestCases.constantDate.getTime(),
    );
    connection = await MockDeviceConnection.create();
    await connection.beforeOperation();
  });

  afterEach(async () => {
    global.Date.now = RealDate;
    await connection.afterOperation();
  });

  test('should be able to get status data', async () => {
    const getOnData =
      (testCase: { statusRequest: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.statusRequest).toEqual(data);
        for (const ackPacket of testCase.ackPackets) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of rawGetStatusTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const status = await getStatus({
        connection,
        version: testCase.version,
      });

      expect(status).toEqual(testCase.status);

      await connection.destroy();
    }
  });

  test('should be able to handle multiple retries', async () => {
    const maxTimeoutTriggers = 3;
    let totalTimeoutTriggers = 0;

    const maxTries = 3;
    let retries = 0;

    const getOnData =
      (testCase: { statusRequest: Uint8Array; ackPackets: Uint8Array[] }) =>
      async () => {
        const currentRetry = retries + 1;

        const doTriggerError =
          Math.random() > 0.5 &&
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

    for (const testCase of rawGetStatusTestCases.valid) {
      retries = 0;

      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const status = await getStatus({
        connection,
        version: testCase.version,
        maxTries,
      });

      expect(status).toEqual(testCase.status);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    const getOnData =
      (testCase: { statusRequest: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.statusRequest).toEqual(data);
        for (const ackPacket of testCase.ackPackets) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of rawGetStatusTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await connection.destroy();
      expect(
        getStatus({
          connection,
          version: testCase.version,
        }),
      ).rejects.toThrow(DeviceConnectionError);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    const getOnData =
      (testCase: { statusRequest: Uint8Array; ackPackets: Uint8Array[] }) =>
      async (data: Uint8Array) => {
        expect(testCase.statusRequest).toEqual(data);
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

    for (const testCase of rawGetStatusTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      expect(
        getStatus({
          connection,
          version: testCase.version,
        }),
      ).rejects.toThrow(DeviceConnectionError);

      await connection.destroy();
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of rawGetStatusTestCases.invalidArgs) {
      const params = {
        connection: testCase.connection as any,
        version: testCase.version as any,
      };

      if (!Object.prototype.hasOwnProperty.call(testCase, 'connection')) {
        params.connection = connection;
      }

      await expect(getStatus(params)).rejects.toBeInstanceOf(Error);
    }
  });
});
