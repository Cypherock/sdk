import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach, jest } from '@jest/globals';
import { getCommandOutput } from '../getCommandOutput';
import { rawGetCommandOutputTestCases } from '../__fixtures__/getCommandOutput';

describe('Raw Operations: getCommandOutput', () => {
  let connection: MockDeviceConnection;

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() =>
      rawGetCommandOutputTestCases.constantDate.getTime(),
    );
    connection = await MockDeviceConnection.create();
    await connection.beforeOperation();
  });

  afterEach(async () => {
    global.Date.now = RealDate;
    await connection.afterOperation();
  });

  test('should be able to get send command', async () => {
    const getOnData =
      (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[][] }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        for (const ackPacket of testCase.ackPackets[packetIndex]) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of rawGetCommandOutputTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const output = await getCommandOutput({
        connection,
        sequenceNumber: testCase.sequenceNumber,
        version: testCase.version,
        maxTries: 1,
      });

      expect(output).toEqual(testCase.output);

      await connection.destroy();
    }
  });

  test('should be able to handle multiple retries', async () => {
    const maxTimeoutTriggers = 3;
    let totalTimeoutTriggers = 0;

    const maxTries = 3;
    let retries: Record<number, number | undefined> = {};

    const getOnData =
      (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[][] }) =>
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
          for (const ackPacket of testCase.ackPackets[packetIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }
        } else {
          totalTimeoutTriggers += 1;
          retries[packetIndex] = currentRetry;
        }
        for (const ackPacket of testCase.ackPackets[packetIndex]) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of rawGetCommandOutputTestCases.valid) {
      retries = {};
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const output = await getCommandOutput({
        connection,
        sequenceNumber: testCase.sequenceNumber,
        version: testCase.version,
        maxTries,
      });

      expect(output).toEqual(testCase.output);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    const getOnData =
      (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[][] }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        for (const ackPacket of testCase.ackPackets[packetIndex]) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of rawGetCommandOutputTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await connection.destroy();
      await expect(
        getCommandOutput({
          connection,
          sequenceNumber: testCase.sequenceNumber,
          version: testCase.version,
          maxTries: 1,
        }),
      ).rejects.toThrow(DeviceConnectionError);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    const getOnData =
      (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[][] }) =>
      async (data: Uint8Array) => {
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

    for (const testCase of rawGetCommandOutputTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await connection.destroy();
      await expect(
        getCommandOutput({
          connection,
          sequenceNumber: testCase.sequenceNumber,
          version: testCase.version,
          maxTries: 1,
        }),
      ).rejects.toThrow(DeviceConnectionError);

      await connection.destroy();
    }
  });

  test('should return valid errors when device returns invalid data', async () => {
    const getOnData =
      (testCase: { packets: Uint8Array[]; ackPackets: Uint8Array[][] }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        for (const ackPacket of testCase.ackPackets[packetIndex]) {
          await connection.mockDeviceSend(ackPacket);
        }
      };

    for (const testCase of rawGetCommandOutputTestCases.error) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await expect(
        getCommandOutput({
          connection,
          sequenceNumber: testCase.sequenceNumber,
          version: testCase.version,
          maxTries: 1,
        }),
      ).rejects.toThrow(testCase.errorInstance);

      await connection.destroy();
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of rawGetCommandOutputTestCases.invalidArgs) {
      const params = {
        connection: testCase.connection as any,
        sequenceNumber: testCase.sequenceNumber as any,
        version: testCase.version as any,
      };

      if (!Object.prototype.hasOwnProperty.call(testCase, 'connection')) {
        params.connection = connection;
      }

      await expect(getCommandOutput(params)).rejects.toBeInstanceOf(Error);
    }
  });
});
