import {
  DeviceBootloaderErrorType,
  deviceBootloaderErrorTypeDetails,
  DeviceCompatibilityErrorType,
  deviceCompatibilityErrorTypeDetails,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { SDK } from '../../src/sdk';
import { PacketVersionMap } from '../../src/utils';
import { config } from '../__fixtures__/config';

describe('Device Raw Operation: v3', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;
  const constantDate = new Date('2023-03-07T09:43:48.755Z');

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() => constantDate.getTime());

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

  test('should have the right sdk version and packet version', () => {
    expect(sdk.getVersion()).toEqual('2.7.1');
    expect(sdk.getPacketVersion()).toEqual(PacketVersionMap.v3);
    expect(sdk.deprecated.isRawOperationSupported()).resolves.toEqual(true);
  });

  test('should be able to get status', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 169, 56, 0, 1, 0, 1, 255, 255, 1, 1, 0, 17, 254, 0,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 193, 143, 0, 1, 0, 1, 255, 255, 4, 1, 0, 18, 8, 11, 0, 0, 0,
          7, 35, 0, 0, 50, 7, 0, 132,
        ]),
      );
    });

    const status = await sdk.deprecated.getCommandStatus();
    expect(status).toEqual({
      deviceState: '23',
      deviceIdleState: 3,
      deviceWaitingOn: 2,
      abortDisabled: false,
      currentCmdSeq: 50,
      cmdState: 7,
      flowStatus: 132,
      isStatus: true,
    });
  });

  test('should be able to send command', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 70, 22, 0, 1, 0, 1, 0, 16, 2, 1, 0, 17, 254, 24, 0, 0, 0, 20,
          0, 0, 0, 12, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231, 183,
          92, 134, 213, 11,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 233, 246, 0, 1, 0, 1, 0, 16, 5, 1, 0, 5, 229, 0,
        ]),
      );
    });

    await connection.beforeOperation();
    await sdk.deprecated.sendCommand({
      data: '626e0158eabd6778b018e7b75c86d50b',
      commandType: 12,
      sequenceNumber: 16,
      maxTries: 1,
    });
  });

  test('should be able to get command output', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 193, 89, 0, 1, 0, 1, 0, 16, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 68, 192, 0, 1, 0, 1, 0, 16, 6, 1, 0, 18, 139, 24, 0, 0, 0, 20,
          0, 0, 0, 12, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231, 183,
          92, 134, 213, 11,
        ]),
      );
    });
    const result = await sdk.deprecated.getCommandOutput(16, 1);

    expect(result).toEqual({
      isStatus: false,
      isRawData: true,
      data: '626e0158eabd6778b018e7b75c86d50b',
      commandType: 12,
    });
  });

  test('should be able to wait for command output', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 193, 89, 0, 1, 0, 1, 0, 16, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 68, 192, 0, 1, 0, 1, 0, 16, 6, 1, 0, 18, 139, 24, 0, 0, 0, 20,
          0, 0, 0, 12, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231, 183,
          92, 134, 213, 11,
        ]),
      );
    });
    const result = await sdk.deprecated.waitForCommandOutput({
      sequenceNumber: 16,
      expectedCommandTypes: [12],
      options: {
        maxTries: 1,
        timeout: config.defaultTimeout,
      },
    });

    expect(result).toEqual({
      isStatus: false,
      isRawData: true,
      data: '626e0158eabd6778b018e7b75c86d50b',
      commandType: 12,
    });
  });

  test('should be able to send abort', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 135, 124, 0, 1, 0, 1, 0, 18, 8, 1, 0, 17, 254, 0,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 143, 73, 0, 1, 0, 1, 0, 18, 4, 1, 0, 18, 86, 11, 0, 0, 0, 7,
          35, 0, 0, 18, 7, 0, 132,
        ]),
      );
    });
    const result = await sdk.deprecated.sendCommandAbort(18);

    expect(result).toEqual({
      deviceState: '23',
      deviceIdleState: 3,
      deviceWaitingOn: 2,
      abortDisabled: false,
      currentCmdSeq: 18,
      cmdState: 7,
      flowStatus: 132,
      isStatus: true,
    });
  });

  test('should throw error when accessing functions for v1', async () => {
    const invalidSDKOperationMessage =
      deviceCompatibilityErrorTypeDetails[
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION
      ].message;

    await expect(
      sdk.deprecated.sendLegacyCommand(1, '00'),
    ).rejects.toThrowError(invalidSDKOperationMessage);
    await expect(sdk.deprecated.receiveLegacyCommand([1], 500)).rejects.toThrow(
      invalidSDKOperationMessage,
    );
  });

  test('should throw error when accessing functions for proto', async () => {
    const invalidSDKOperationMessage =
      deviceCompatibilityErrorTypeDetails[
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION
      ].message;

    await expect(sdk.sendQuery(new Uint8Array([10]))).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.getResult()).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.waitForResult()).rejects.toThrowError(
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
