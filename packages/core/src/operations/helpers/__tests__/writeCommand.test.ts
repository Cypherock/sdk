import {
  DeviceConnectionError,
  ConnectionTypeMap,
  DeviceState,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach, beforeEach, test } from '@jest/globals';
import { sleep } from '@cypherock/sdk-utils';
import { PacketVersionMap } from '../../../utils';
import { writeCommand } from '../writeCommand';
import { writeCommandHelperTestCases } from '../__fixtures__/writeCommand';

describe('Operation Helpers: writeCommand', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
    await connection.beforeOperation();
  });

  afterEach(async () => {
    await connection.afterOperation();
  });

  test('should be able to write command', async () => {
    for (const testCase of writeCommandHelperTestCases.valid) {
      connection.removeListeners();
      connection.configureDevice(
        DeviceState.MAIN,
        ConnectionTypeMap.SERIAL_PORT,
      );

      const onData = (data: Uint8Array) => {
        expect(data).toEqual(testCase.packet);
      };
      connection.configureListeners(onData);

      const resultPromise = writeCommand({
        connection,
        packet: testCase.packet,
        sequenceNumber: testCase.sequenceNumber,
        ackPacketTypes: testCase.ackPacketTypes,
        version: PacketVersionMap.v3,
        timeout: 500,
      });

      for (const ackPacket of testCase.ackPackets) {
        await sleep(20);
        await connection.mockDeviceSend(ackPacket);
      }

      const result = await resultPromise;
      expect(result).toBeDefined();
      expect(result).toEqual(testCase.decodedAckPacket);
    }
  });

  test('should return valid errors when device returns invalid data', async () => {
    expect.assertions(writeCommandHelperTestCases.error.length * 2);
    for (const testCase of writeCommandHelperTestCases.error) {
      connection.removeListeners();
      connection.configureDevice(
        DeviceState.MAIN,
        ConnectionTypeMap.SERIAL_PORT,
      );

      const onData = (data: Uint8Array) => {
        expect(data).toEqual(testCase.packet);
      };
      connection.configureListeners(onData);

      const resultPromise = writeCommand({
        connection,
        packet: testCase.packet,
        sequenceNumber: testCase.sequenceNumber,
        ackPacketTypes: testCase.ackPacketTypes,
        version: PacketVersionMap.v3,
        timeout: 500,
      }).catch(error => {
        expect(error).toBeInstanceOf(testCase.errorInstance);
      });

      for (const ackPacket of testCase.ackPackets) {
        await sleep(20);
        await connection.mockDeviceSend(ackPacket);
      }

      await resultPromise;
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    expect.assertions(writeCommandHelperTestCases.valid.length);
    for (const testCase of writeCommandHelperTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();
      connection.configureDevice(
        DeviceState.MAIN,
        ConnectionTypeMap.SERIAL_PORT,
      );

      await connection.destroy();
      const resultPromise = writeCommand({
        connection,
        packet: testCase.packet,
        sequenceNumber: testCase.sequenceNumber,
        ackPacketTypes: testCase.ackPacketTypes,
        version: PacketVersionMap.v3,
        timeout: 500,
      }).catch(error => {
        expect(error).toBeInstanceOf(DeviceConnectionError);
      });

      await resultPromise;
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    expect.assertions(writeCommandHelperTestCases.valid.length * 2);
    for (const testCase of writeCommandHelperTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();
      connection.configureDevice(
        DeviceState.MAIN,
        ConnectionTypeMap.SERIAL_PORT,
      );

      const onData = (data: Uint8Array) => {
        expect(data).toEqual(testCase.packet);
      };
      connection.configureListeners(onData);

      const resultPromise = writeCommand({
        connection,
        packet: testCase.packet,
        sequenceNumber: testCase.sequenceNumber,
        ackPacketTypes: testCase.ackPacketTypes,
        version: PacketVersionMap.v3,
        timeout: 500,
      }).catch(error => {
        expect(error).toBeInstanceOf(DeviceConnectionError);
      });

      for (let i = 0; i < testCase.ackPackets.length; i += 1) {
        const ackPacket = testCase.ackPackets[i];
        await sleep(20);

        if (i === testCase.ackPacketTypes.length - 1) {
          await connection.destroy();
        } else {
          await connection.mockDeviceSend(ackPacket);
        }
      }

      await resultPromise;
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of writeCommandHelperTestCases.invalidArgs) {
      const params = {
        connection: testCase.connection as any,
        packet: testCase.packet as any,
        sequenceNumber: testCase.sequenceNumber as any,
        ackPacketTypes: testCase.ackPacketTypes as any,
        version: testCase.version as any,
      };

      if (!Object.prototype.hasOwnProperty.call(testCase, 'connection')) {
        params.connection = connection;
      }

      await expect(writeCommand(params)).rejects.toBeInstanceOf(Error);
    }
  });
});
