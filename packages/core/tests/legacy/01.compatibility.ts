import {
  DeviceBootloaderErrorType,
  deviceBootloaderErrorTypeDetails,
  DeviceCompatibilityErrorType,
  deviceCompatibilityErrorTypeDetails,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { SDK } from '../../src/sdk';
import { PacketVersionMap } from '../../src/utils';

describe('Legacy Device Operation: v1', () => {
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
    await connection.beforeOperation();

    connection.removeListeners();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  test('should have the right sdk version and packet version', () => {
    expect(sdk.getVersion()).toEqual('0.1.16');
    expect(sdk.getPacketVersion()).toEqual(PacketVersionMap.v1);
    expect(sdk.deprecated.isLegacyOperationSupported()).resolves.toEqual(true);
  });

  test('should be able to send data', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          170, 41, 18, 0, 1, 0, 1, 91, 97, 90, 61, 195, 142, 70, 183, 84, 241,
          81, 118, 77, 27,
        ]),
      );
      connection.mockDeviceSend(new Uint8Array([170, 1, 6, 0, 0, 0, 0, 0]));
    });

    await sdk.deprecated.sendLegacyCommand(41, '5b615a3dc38e46b754f15176');
  });

  test('should be able to receive data', async () => {
    await connection.mockDeviceSend(
      new Uint8Array([
        170, 8, 38, 0, 1, 0, 1, 15, 172, 244, 76, 162, 3, 152, 84, 158, 82, 205,
        188, 202, 12, 191, 131, 89, 174, 60, 16, 59, 108, 180, 107, 231, 166, 4,
        166, 217, 119, 249, 22, 204, 219,
      ]),
    );
    const result = await sdk.deprecated.receiveLegacyCommand([8, 12]);

    expect(result.commandType).toEqual(8);
    expect(result.data).toEqual(
      '0facf44ca20398549e52cdbcca0cbf8359ae3c103b6cb46be7a604a6d977f916',
    );
  });

  test('should throw error when accessing functions for v3', async () => {
    const invalidSDKOperationMessage =
      deviceCompatibilityErrorTypeDetails[
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION
      ].message;

    await expect(
      sdk.deprecated.sendCommand({
        commandType: 1,
        data: '00',
        sequenceNumber: 1,
      }),
    ).rejects.toThrowError(invalidSDKOperationMessage);
    await expect(sdk.deprecated.getCommandOutput(1)).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(
      sdk.deprecated.waitForCommandOutput({
        sequenceNumber: 1,
        expectedCommandTypes: [1],
      }),
    ).rejects.toThrowError(invalidSDKOperationMessage);
    await expect(sdk.deprecated.getCommandStatus()).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.deprecated.sendCommandAbort(1)).rejects.toThrowError(
      invalidSDKOperationMessage,
    );

    await expect(sdk.sendQuery(new Uint8Array([10]))).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.waitForResult()).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.getResult()).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.getStatus()).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.sendAbort()).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
  });

  test('should throw error when accessing bootloader functions', async () => {
    const notInBootloaderError =
      deviceBootloaderErrorTypeDetails[
        DeviceBootloaderErrorType.NOT_IN_BOOTLOADER
      ].message;

    await expect(sdk.sendBootloaderAbort()).rejects.toThrowError(
      notInBootloaderError,
    );
    await expect(sdk.sendBootloaderData('12')).rejects.toThrowError(
      notInBootloaderError,
    );
  });
});
