import {
  DeviceConnectionError,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { describe, test, expect, afterEach, beforeEach } from '@jest/globals';
import { SDK } from '../../src';
import { config } from '../__fixtures__/config';
import fixtures from './__fixtures__/receiveLegacyCommand';

describe('sdk.deprecated.receiveLegacyCommand', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();

    const onData = async () => {
      // SDK Version: 0.1.16, PacketVersion: v1
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 0, 0,
          1, 0, 16, 118, 67,
        ]),
      );
    };
    connection.configureListeners(onData);

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
            await connection.mockDeviceSend(data);
          }
        };

        const [response] = await Promise.all([
          sdk.deprecated.receiveLegacyCommand(
            testCase.params.allAcceptableCommands,
            testCase.output.data.length > 200 ? 1200 : config.defaultTimeout,
          ),
          sendDataFromDevice(testCase.packetsFromDevice),
        ]);

        expect(response.data).toEqual(testCase.output.data);
        expect(response.commandType).toEqual(testCase.output.commandType);
      });
    });
  });

  describe('should throw error when device is disconnected', () => {
    fixtures.valid.forEach(testCase => {
      test(testCase.name, async () => {
        expect.assertions(1);
        await connection.destroy();
        await expect(
          sdk.deprecated.receiveLegacyCommand(
            testCase.params.allAcceptableCommands,
            config.defaultTimeout,
          ),
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
            if (i >= packetsFromDevice.length - 1) {
              await connection.destroy();
            } else {
              await connection.mockDeviceSend(data);
            }
            i += 1;
          }
        };

        const [response] = await Promise.allSettled([
          sdk.deprecated.receiveLegacyCommand(
            testCase.params.allAcceptableCommands,
            config.defaultTimeout,
          ),
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
          sdk.deprecated.receiveLegacyCommand(
            params.allAcceptableCommands,
            config.defaultTimeout,
          ),
        ).rejects.toBeInstanceOf(Error);
      });
    }, 200);
  });
});
