import {
  DeviceCommunicationErrorType,
  deviceCommunicationErrorTypeDetails,
  DeviceState,
  MockDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { SDK } from '../../src/sdk';

describe('Bootloader Operation', () => {
  let connection: MockDeviceConnection;
  let sdk: SDK;
  const appletId = 0;

  beforeEach(async () => {
    connection = await MockDeviceConnection.create();

    connection.configureDevice(DeviceState.BOOTLOADER, 'MOCK');

    sdk = await SDK.create(connection, appletId);
    await connection.beforeOperation();

    connection.removeListeners();
  });

  afterEach(async () => {
    await connection.destroy();
  });

  test('should have the right configuration', () => {
    expect(sdk.getVersion()).toEqual('0.0.0');
    expect(sdk.getPacketVersion()).toEqual(undefined);
    expect(sdk.getDeviceState()).resolves.toEqual(DeviceState.BOOTLOADER);

    expect(sdk.isInBootloader()).resolves.toEqual(true);
    expect(sdk.isSupported()).resolves.toEqual(false);
  });

  test('should be able to send abort', async () => {
    connection.configureListeners(async data => {
      expect(data).toEqual(new Uint8Array([65]));
      await connection.mockDeviceSend(new Uint8Array([24]));
    });

    await sdk.sendBootloaderAbort();
  });

  test('should be able to send data', async () => {
    const packets = [
      new Uint8Array([
        1, 1, 254, 20, 121, 36, 79, 49, 242, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
        255, 255, 255, 250, 80,
      ]),
      new Uint8Array([4]),
    ];
    connection.configureListeners(async data => {
      const packetIndex = packets.findIndex(
        elem => elem.toString() === data.toString(),
      );
      expect(packets).toContainEqual(data);
      expect(packetIndex).toBeGreaterThanOrEqual(0);
      await connection.mockDeviceSend(new Uint8Array([6]));
    });

    // Set in receiving mode
    await connection.mockDeviceSend(new Uint8Array([67]));

    await sdk.sendBootloaderData('1479244f31f2');
  });

  test('should throw error when accessing other functions for v3', async () => {
    const inBootloaderError =
      deviceCommunicationErrorTypeDetails[
        DeviceCommunicationErrorType.IN_BOOTLOADER
      ].message;

    await expect(
      sdk.deprecated.sendLegacyCommand(1, '00'),
    ).rejects.toThrowError(inBootloaderError);
    await expect(sdk.deprecated.receiveLegacyCommand([1], 500)).rejects.toThrow(
      inBootloaderError,
    );

    await expect(
      sdk.deprecated.sendCommand({
        commandType: 1,
        data: '00',
        sequenceNumber: 1,
      }),
    ).rejects.toThrowError(inBootloaderError);
    await expect(sdk.deprecated.getCommandOutput(1)).rejects.toThrowError(
      inBootloaderError,
    );
    await expect(
      sdk.deprecated.waitForCommandOutput({
        sequenceNumber: 1,
        expectedCommandTypes: [1],
      }),
    ).rejects.toThrowError(inBootloaderError);
    await expect(sdk.deprecated.getCommandStatus()).rejects.toThrowError(
      inBootloaderError,
    );
    await expect(sdk.deprecated.sendCommandAbort(1)).rejects.toThrowError(
      inBootloaderError,
    );

    await expect(sdk.sendQuery(new Uint8Array([10]))).rejects.toThrowError(
      inBootloaderError,
    );
    await expect(sdk.waitForResult()).rejects.toThrowError(inBootloaderError);
    await expect(sdk.getResult()).rejects.toThrowError(inBootloaderError);
    await expect(sdk.getStatus()).rejects.toThrowError(inBootloaderError);
    await expect(sdk.sendAbort()).rejects.toThrowError(inBootloaderError);
  });
});
