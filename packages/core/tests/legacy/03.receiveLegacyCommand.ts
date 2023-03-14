import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, test, expect, afterEach, beforeEach } from '@jest/globals';
import SDK from '../../src';
import { sleep } from '../../src/utils';
import fixtures from './__fixtures__/receiveLegacyCommand';

describe('sdk.receiveLegacyCommand', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  let appletId = 0;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();

    const getOnData = async () => {
      // SDK Version: 0.1.16, PacketVersion: v1
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 0, 0,
          1, 0, 16, 118, 67,
        ]),
      );
    };
    connection.configureListeners(getOnData);

    sdk = await SDK.create(connection, appletId);
    await sdk.beforeOperation();

    connection.removeListeners();
  });

  afterEach(async () => {
    await sdk.destroy();
  });

  describe('should be able to receive data', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        const sendDataFromDevice = async (packetsFromDevice: Uint8Array[]) => {
          for (const data of packetsFromDevice) {
            await sleep(20);
            await connection.mockDeviceSend(data);
          }
        };

        const [response] = await Promise.all([
          sdk.receiveLegacyCommand(testCase.params.allAcceptableCommands, 2000),
          sendDataFromDevice(testCase.packetsFromDevice),
        ]);

        expect(response.data).toEqual(testCase.output.data);
        expect(response.commandType).toEqual(testCase.output.commandType);

        await connection.destroy();
      });
    });
  });

  describe('should throw error when device is disconnected', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(1);
        await connection.destroy();
        await expect(
          sdk.receiveLegacyCommand(testCase.params.allAcceptableCommands, 500),
        ).rejects.toBeInstanceOf(DeviceConnectionError);
      });
    });
  });

  describe('should throw error when device is disconnected in between', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(2);
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

        const [response] = await Promise.allSettled([
          sdk.receiveLegacyCommand(testCase.params.allAcceptableCommands, 2000),
          sendDataFromDevice(testCase.packetsFromDevice),
        ]);

        expect(response.status).toEqual('rejected');
        if (response.status === 'rejected') {
          expect(response.reason).toBeInstanceOf(DeviceConnectionError);
        }
      });
    });
  });

  describe('should throw error with invalid arguments', () => {
    fixtures.invalidArgs.forEach(testCase => {
      test(JSON.stringify(testCase), async () => {
        const params = {
          allAcceptableCommands: testCase.allAcceptableCommands as any,
        };

        await expect(
          sdk.receiveLegacyCommand(params.allAcceptableCommands),
        ).rejects.toBeInstanceOf(Error);
      });
    });
  });
});
