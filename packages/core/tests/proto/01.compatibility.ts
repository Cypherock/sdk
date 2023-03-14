import {
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
import SDK from '../../src/sdk';
import { PacketVersionMap } from '../../src/utils';

describe('Device Proto Operation: v3', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  let appletId = 12;
  const constantDate = new Date('2023-03-07T09:43:48.755Z');

  const RealDate = Date.now;

  beforeEach(async () => {
    global.Date.now = jest.fn(() => constantDate.getTime());

    connection = await MockDeviceConnection.create();

    const onData = async () => {
      // SDK Version: 3.0.1, Packet Version: v3
      await connection.mockDeviceSend(
        new Uint8Array([
          170, 1, 7, 0, 1, 0, 1, 0, 69, 133, 170, 88, 12, 0, 1, 0, 1, 0, 3, 0,
          0, 0, 1, 173, 177,
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
    expect(sdk.getVersion()).toEqual('3.0.1');
    expect(sdk.getPacketVersion()).toEqual(PacketVersionMap.v3);
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
          85, 85, 41, 170, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11, 0,
          0, 8, 2, 16, 3, 32, 50, 40, 7, 48, 132, 1,
        ]),
      );
    });

    const status = await sdk.getStatus();
    expect(status).toEqual({
      deviceIdleState: 3,
      deviceWaitingOn: 2,
      abortDisabled: false,
      currentCmdSeq: 50,
      cmdState: 7,
      flowStatus: 132,
    });
  });

  test('should be able to send query', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 161, 179, 0, 1, 0, 1, 0, 16, 2, 1, 0, 17, 254, 26, 0, 22, 0,
          0, 10, 20, 8, 12, 18, 16, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24,
          231, 183, 92, 134, 213, 11,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 233, 246, 0, 1, 0, 1, 0, 16, 5, 1, 0, 5, 229, 0,
        ]),
      );
    });

    await sdk.sendQuery({
      data: new Uint8Array([
        98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231, 183, 92, 134, 213, 11,
      ]),
      sequenceNumber: 16,
      maxTries: 1,
    });
  });

  test('should be able to get result', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 193, 89, 0, 1, 0, 1, 0, 16, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 212, 138, 0, 1, 0, 1, 0, 16, 6, 1, 0, 17, 254, 26, 0, 22, 0,
          0, 10, 20, 8, 12, 18, 16, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24,
          231, 183, 92, 134, 213, 11,
        ]),
      );
    });
    const result = await sdk.getResult(16);

    expect(result).toEqual({
      isStatus: false,
      result: new Uint8Array([
        98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231, 183, 92, 134, 213, 11,
      ]),
    });
  });

  test('should be able to wait for result', async () => {
    connection.configureListeners(data => {
      expect(data).toEqual(
        new Uint8Array([
          85, 85, 193, 89, 0, 1, 0, 1, 0, 16, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      );
      connection.mockDeviceSend(
        new Uint8Array([
          85, 85, 212, 138, 0, 1, 0, 1, 0, 16, 6, 1, 0, 17, 254, 26, 0, 22, 0,
          0, 10, 20, 8, 12, 18, 16, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24,
          231, 183, 92, 134, 213, 11,
        ]),
      );
    });
    const result = await sdk.waitForResult({
      sequenceNumber: 16,
      maxTries: 1,
    });

    expect(result).toEqual(
      new Uint8Array([
        98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231, 183, 92, 134, 213, 11,
      ]),
    );
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
          85, 85, 28, 162, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11, 0,
          0, 8, 2, 16, 3, 32, 18, 40, 7, 48, 132, 1,
        ]),
      );
    });
    const result = await sdk.sendAbort(18);

    expect(result).toEqual({
      deviceIdleState: 3,
      deviceWaitingOn: 2,
      abortDisabled: false,
      currentCmdSeq: 18,
      cmdState: 7,
      flowStatus: 132,
    });
  });

  test('should throw error when accessing functions for v1', async () => {
    const invalidSDKOperationMessage =
      deviceCompatibilityErrorTypeDetails[
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION
      ].message;

    await expect(sdk.sendLegacyCommand(1, '00')).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.receiveLegacyCommand([1], 500)).rejects.toThrow(
      invalidSDKOperationMessage,
    );
  });

  test('should throw error when accessing functions for raw command', async () => {
    const invalidSDKOperationMessage =
      deviceCompatibilityErrorTypeDetails[
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION
      ].message;

    await expect(
      sdk.sendCommand({ commandType: 1, data: '00', sequenceNumber: 1 }),
    ).rejects.toThrowError(invalidSDKOperationMessage);
    await expect(sdk.getCommandOutput(1)).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(
      sdk.waitForCommandOutput({
        sequenceNumber: 1,
        expectedCommandTypes: [1],
      }),
    ).rejects.toThrowError(invalidSDKOperationMessage);
    await expect(sdk.getCommandStatus()).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
    await expect(sdk.sendCommandAbort(1)).rejects.toThrowError(
      invalidSDKOperationMessage,
    );
  });
});
