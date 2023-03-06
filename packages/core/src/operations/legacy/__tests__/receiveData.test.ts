import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, expect, afterEach } from '@jest/globals';
import { sleep } from '../../../utils';
import { receiveData } from '../receiveData';
import { legacyReceiveDataTestCases } from '../__fixtures__/receiveData';

describe('Legacy Operations: receiveData', () => {
  let connection: MockDeviceConnection;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();
    await connection.beforeOperation();
  });

  afterEach(async () => {
    await connection.afterOperation();
  });

  test('should be able to receive data', async () => {
    const sendDataFromDevice = async (packetsFromDevice: Uint8Array[]) => {
      for (const data of packetsFromDevice) {
        await sleep(20);
        await connection.mockDeviceSend(data);
      }
    };

    for (const testCase of legacyReceiveDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      const [response] = await Promise.all([
        receiveData(
          connection,
          testCase.allAcceptableCommands,
          testCase.version,
          2000,
        ),
        sendDataFromDevice(testCase.packetsFromDevice),
      ]);

      expect(response.data).toEqual(testCase.data);
      expect(response.commandType).toEqual(testCase.commandType);

      await connection.destroy();
    }
  });

  test('should return valid errors when device is disconnected', async () => {
    for (const testCase of legacyReceiveDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      await connection.destroy();
      await expect(
        receiveData(
          connection,
          testCase.allAcceptableCommands,
          testCase.version,
          2000,
        ),
      ).rejects.toBeInstanceOf(DeviceConnectionError);
    }
  });

  test('should return valid errors when device is disconnected in between', async () => {
    expect.assertions(legacyReceiveDataTestCases.valid.length * 2);
    const sendDataFromDevice = async (packetsFromDevice: Uint8Array[]) => {
      let i = 0;

      for (const data of packetsFromDevice) {
        await sleep(20);

        if (i >= packetsFromDevice.length - 1) {
          await connection.destroy();
        } else {
          await connection.mockDeviceSend(data);
        }
        i += 1;
      }
    };

    for (const testCase of legacyReceiveDataTestCases.valid) {
      connection = await MockDeviceConnection.create();
      await connection.beforeOperation();

      connection.removeListeners();

      const [response] = await Promise.allSettled([
        receiveData(
          connection,
          testCase.allAcceptableCommands,
          testCase.version,
          2000,
        ),
        sendDataFromDevice(testCase.packetsFromDevice),
      ]);

      expect(response.status).toEqual('rejected');
      if (response.status === 'rejected') {
        expect(response.reason).toBeInstanceOf(DeviceConnectionError);
      }

      await connection.destroy();
    }
  });

  test('should throw error with invalid arguments', async () => {
    for (const testCase of legacyReceiveDataTestCases.invalidArgs) {
      const params = {
        connection: testCase.connection as any,
        allAcceptableCommands: testCase.allAcceptableCommands as any,
        version: testCase.version as any,
      };

      if (!Object.prototype.hasOwnProperty.call(testCase, 'connection')) {
        params.connection = connection;
      }

      await expect(
        receiveData(
          params.connection,
          params.allAcceptableCommands,
          params.version,
        ),
      ).rejects.toBeInstanceOf(Error);
    }
  });
});
