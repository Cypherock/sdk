import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach, jest } from '@jest/globals';
import { waitForCommandOutput } from '../waitForCommandOutput';
import { rawWaitForCommandOutputTestCases } from '../__fixtures__/waitForCommandOutput';

describe('Raw Operations: waitForCommandOutput', () => {
  let connection: MockDeviceConnection;

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() =>
      rawWaitForCommandOutputTestCases.constantDate.getTime(),
    );
    connection = await MockDeviceConnection.create();
    await connection.beforeOperation();
  });

  afterEach(async () => {
    global.Date.now = RealDate;
    await connection.afterOperation();
  });

  test('should be able to get command', async () => {
    let statusIndex = 0;

    const getOnData =
      (testCase: {
        packets: Uint8Array[];
        outputPackets: Uint8Array[][];
        statusPackets: Uint8Array[][];
      }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        if (packetIndex === 0 && statusIndex < testCase.statusPackets.length) {
          for (const ackPacket of testCase.statusPackets[statusIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }

          statusIndex += 1;
        } else {
          for (const ackPacket of testCase.outputPackets[packetIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }
        }
      };

    const getOnStatus =
      (testCase: { statusList: any[] }) => async (status: any) => {
        expect(status).toEqual(testCase.statusList[statusIndex - 1]);
      };

    for (const testCase of rawWaitForCommandOutputTestCases.valid) {
      statusIndex = 0;
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const output = await waitForCommandOutput({
        connection,
        sequenceNumber: testCase.sequenceNumber,
        version: testCase.version,
        expectedCommandTypes: testCase.expectedCommandTypes,
        onStatus: getOnStatus(testCase),
        maxTries: 1,
        options: { interval: 20 },
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

    let statusIndex = 0;

    const getOnData =
      (testCase: {
        packets: Uint8Array[];
        outputPackets: Uint8Array[][];
        statusPackets: Uint8Array[][];
      }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);

        if (packetIndex === 0 && statusIndex < testCase.statusPackets.length) {
          for (const ackPacket of testCase.statusPackets[statusIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }

          statusIndex += 1;
        } else {
          const currentRetry = (retries[packetIndex] ?? 0) + 1;
          const doTriggerError =
            Math.random() < 0.5 &&
            currentRetry < maxTries &&
            totalTimeoutTriggers < maxTimeoutTriggers;

          if (!doTriggerError) {
            for (const ackPacket of testCase.outputPackets[packetIndex]) {
              await connection.mockDeviceSend(ackPacket);
            }
          } else {
            totalTimeoutTriggers += 1;
            retries[packetIndex] = currentRetry;
          }
        }
      };

    const getOnStatus =
      (testCase: { statusList: any[] }) => async (status: any) => {
        expect(status).toEqual(testCase.statusList[statusIndex - 1]);
      };

    for (const testCase of rawWaitForCommandOutputTestCases.valid) {
      retries = {};
      statusIndex = 0;
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      const output = await waitForCommandOutput({
        connection,
        sequenceNumber: testCase.sequenceNumber,
        version: testCase.version,
        expectedCommandTypes: testCase.expectedCommandTypes,
        onStatus: getOnStatus(testCase),
        maxTries,
        options: { interval: 20 },
      });

      expect(output).toEqual(testCase.output);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    let statusIndex = 0;

    const getOnData =
      (testCase: {
        packets: Uint8Array[];
        outputPackets: Uint8Array[][];
        statusPackets: Uint8Array[][];
      }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        if (packetIndex === 0 && statusIndex < testCase.statusPackets.length) {
          for (const ackPacket of testCase.statusPackets[statusIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }

          statusIndex += 1;
        } else {
          for (const ackPacket of testCase.outputPackets[packetIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }
        }
      };

    const getOnStatus =
      (testCase: { statusList: any[] }) => async (status: any) => {
        expect(status).toEqual(testCase.statusList[statusIndex - 1]);
      };

    for (const testCase of rawWaitForCommandOutputTestCases.valid) {
      statusIndex = 0;
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await connection.destroy();
      await expect(
        waitForCommandOutput({
          connection,
          sequenceNumber: testCase.sequenceNumber,
          version: testCase.version,
          expectedCommandTypes: testCase.expectedCommandTypes,
          onStatus: getOnStatus(testCase),
          maxTries: 1,
          options: { interval: 20 },
        }),
      ).rejects.toThrow(DeviceConnectionError);
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    let statusIndex = 0;

    const getOnData =
      (testCase: {
        packets: Uint8Array[];
        outputPackets: Uint8Array[][];
        statusPackets: Uint8Array[][];
      }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        if (packetIndex === 0 && statusIndex < testCase.statusPackets.length) {
          for (const ackPacket of testCase.statusPackets[statusIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }

          statusIndex += 1;
        } else {
          let i = 0;
          for (const ackPacket of testCase.outputPackets[packetIndex]) {
            if (i >= testCase.outputPackets[packetIndex].length - 1) {
              await connection.destroy();
            } else {
              await connection.mockDeviceSend(ackPacket);
            }
            i += 1;
          }
        }
      };

    const getOnStatus =
      (testCase: { statusList: any[] }) => async (status: any) => {
        expect(status).toEqual(testCase.statusList[statusIndex - 1]);
      };

    for (const testCase of rawWaitForCommandOutputTestCases.valid) {
      statusIndex = 0;
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await expect(
        waitForCommandOutput({
          connection,
          sequenceNumber: testCase.sequenceNumber,
          version: testCase.version,
          expectedCommandTypes: testCase.expectedCommandTypes,
          onStatus: getOnStatus(testCase),
          maxTries: 1,
          options: { interval: 20 },
        }),
      ).rejects.toThrow(DeviceConnectionError);
    }
  });

  test('should return valid errors when device returns invalid data', async () => {
    let statusIndex = 0;

    const getOnData =
      (testCase: {
        packets: Uint8Array[];
        outputPackets: Uint8Array[][];
        statusPackets: Uint8Array[][];
      }) =>
      async (data: Uint8Array) => {
        const packetIndex = testCase.packets.findIndex(
          elem => elem.toString() === data.toString(),
        );
        expect(testCase.packets).toContainEqual(data);
        expect(packetIndex).toBeGreaterThanOrEqual(0);
        if (packetIndex === 0 && statusIndex < testCase.statusPackets.length) {
          for (const ackPacket of testCase.statusPackets[statusIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }

          statusIndex += 1;
        } else {
          for (const ackPacket of testCase.outputPackets[packetIndex]) {
            await connection.mockDeviceSend(ackPacket);
          }
        }
      };

    const getOnStatus =
      (testCase: { statusList: any[] }) => async (status: any) => {
        expect(status).toEqual(testCase.statusList[statusIndex - 1]);
      };

    for (const testCase of rawWaitForCommandOutputTestCases.error) {
      statusIndex = 0;
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      connection.configureListeners(getOnData(testCase));
      await expect(
        waitForCommandOutput({
          connection,
          sequenceNumber: testCase.sequenceNumber,
          version: testCase.version,
          expectedCommandTypes: testCase.expectedCommandTypes,
          onStatus: getOnStatus(testCase),
          maxTries: 1,
          options: { interval: 20 },
        }),
      ).rejects.toThrow(testCase.errorInstance);
      await connection.destroy();
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of rawWaitForCommandOutputTestCases.invalidArgs) {
      const params = {
        connection: testCase.connection as any,
        sequenceNumber: testCase.sequenceNumber as any,
        version: testCase.version as any,
        expectedCommandTypes: testCase.expectedCommandTypes as any,
      };

      if (!Object.prototype.hasOwnProperty.call(testCase, 'connection')) {
        params.connection = connection;
      }

      await expect(waitForCommandOutput(params)).rejects.toBeInstanceOf(Error);
    }
  });
});
