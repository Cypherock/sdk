import {
  DeviceBootloaderError,
  DeviceBootloaderErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  DeviceState,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import * as bootloaderOperations from './operations/bootloader';
import * as legacyOperations from './operations/legacy';
import * as operations from './operations/proto';
import { getPacketVersionFromSDK, formatSDKVersion } from './utils/sdkVersions';
import { PacketVersion, PacketVersionMap } from './utils/packetVersions';
import assert from './utils/assert';
import { FeatureName, isFeatureEnabled } from './utils/featureMap';
import { ISDK } from './types';
import DeprecatedCommunication from './deprecated';

export default class SDK implements ISDK {
  private readonly version: string;

  private readonly packetVersion?: PacketVersion;

  private readonly connection: IDeviceConnection;

  private appletId: number;

  public deprecated: DeprecatedCommunication;

  public constructor(
    connection: IDeviceConnection,
    appletId: number,
    version: string,
    packetVersion?: PacketVersion,
  ) {
    this.connection = connection;
    this.version = version;
    this.packetVersion = packetVersion;
    this.appletId = appletId;
    this.deprecated = new DeprecatedCommunication(this);
  }

  public static async create(connection: IDeviceConnection, appletId: number) {
    const sdkData = await SDK.getSDKVersion(connection);
    return new SDK(
      connection,
      appletId,
      sdkData.sdkVersion,
      sdkData.packetVersion,
    );
  }

  public getConnection() {
    return this.connection;
  }

  public getVersion() {
    return this.version;
  }

  public getPacketVersion() {
    return this.packetVersion;
  }

  public isSupported() {
    if (this.getDeviceState() === DeviceState.BOOTLOADER) {
      return false;
    }

    return isFeatureEnabled(FeatureName.ProtoCommand, this.getVersion());
  }

  public getSequenceNumber() {
    return this.connection.getSequenceNumber();
  }

  public getNewSequenceNumber() {
    return this.connection.getNewSequenceNumber();
  }

  public beforeOperation() {
    return this.connection.beforeOperation();
  }

  public afterOperation() {
    return this.connection.afterOperation();
  }

  public configureAppletId(appletId: number) {
    this.appletId = appletId;
  }

  public destroy() {
    return this.connection.destroy();
  }

  public isInBootloader() {
    return this.getDeviceState() === DeviceState.BOOTLOADER;
  }

  public getDeviceState() {
    return this.connection.getDeviceState();
  }

  // ************** v3 Packet Version with protobuf ****************
  public async sendQuery(params: {
    data: Uint8Array;
    sequenceNumber: number;
    maxTries?: number;
  }): Promise<void> {
    this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!this.isSupported()) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.sendQuery({
      connection: this.connection,
      data: params.data,
      appletId: this.appletId,
      sequenceNumber: params.sequenceNumber,
      version: this.packetVersion,
      maxTries: params.maxTries,
    });
  }

  public async getResult(sequenceNumber: number, maxTries?: number) {
    this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!this.isSupported()) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.getResult({
      connection: this.connection,
      appletId: this.appletId,
      sequenceNumber,
      version: this.packetVersion,
      maxTries,
    });
  }

  public async waitForResult(params: {
    sequenceNumber: operations.IWaitForCommandOutputParams['sequenceNumber'];
    onStatus?: operations.IWaitForCommandOutputParams['onStatus'];
    maxTries?: operations.IWaitForCommandOutputParams['maxTries'];
    options?: operations.IWaitForCommandOutputParams['options'];
  }) {
    this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!this.isSupported()) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.waitForResult({
      connection: this.connection,
      version: this.packetVersion,
      appletId: this.appletId,
      ...params,
    });
  }

  public async getStatus(maxTries?: number) {
    this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!this.isSupported()) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.getStatus({
      connection: this.connection,
      version: this.packetVersion,
      maxTries,
    });
  }

  public async sendAbort(sequenceNumber: number, maxTries?: number) {
    this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!this.isSupported()) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.sendAbort({
      connection: this.connection,
      sequenceNumber,
      version: this.packetVersion,
      maxTries,
    });
  }

  // ************** Bootloader operations ****************
  public async sendBootloaderAbort(
    maxTries?: number,
    options?: { firstTimeout?: number; timeout?: number },
  ) {
    if (!this.isInBootloader()) {
      throw new DeviceBootloaderError(
        DeviceBootloaderErrorType.NOT_IN_BOOTLOADER,
      );
    }

    return bootloaderOperations.sendBootloaderAbort(
      this.connection,
      maxTries,
      options,
    );
  }

  public async sendBootloaderData(
    data: string,
    onProgress?: (progress: number) => void,
    maxTries?: number,
    options?: { firstTimeout?: number; timeout?: number },
  ) {
    if (!this.isInBootloader()) {
      throw new DeviceBootloaderError(
        DeviceBootloaderErrorType.NOT_IN_BOOTLOADER,
      );
    }

    return bootloaderOperations.sendBootloaderData(
      this.connection,
      data,
      onProgress,
      maxTries,
      options,
    );
  }

  public async wrapOperation<R>(operation: () => Promise<R>) {
    try {
      await this.connection.beforeOperation();
      const result = await operation();
      await this.connection.afterOperation();

      return result;
    } catch (error) {
      await this.connection.afterOperation();
      throw error;
    }
  }

  public validateNotInBootloaderMode() {
    if (this.isInBootloader()) {
      throw new DeviceCommunicationError(
        DeviceCommunicationErrorType.IN_BOOTLOADER,
      );
    }
  }

  private static async getSDKVersion(
    connection: IDeviceConnection,
    maxTries?: number,
    options?: { timeout?: number },
  ) {
    assert(connection, 'Invalid connection');

    if (connection.getDeviceState() === DeviceState.BOOTLOADER) {
      return {
        sdkVersion: '0.0.0',
      };
    }

    let retries = 0;
    const innerMaxTries = maxTries ?? 2;
    let firstError: Error = new DeviceCommunicationError(
      DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR,
    );

    await connection.beforeOperation();
    while (retries < innerMaxTries) {
      try {
        await legacyOperations.sendData(
          connection,
          88,
          '00',
          PacketVersionMap.v1,
          innerMaxTries,
        );

        const sdkVersionData = await legacyOperations.receiveData(
          connection,
          [88],
          PacketVersionMap.v1,
          options?.timeout ?? 5000,
        );

        const sdkVersion = formatSDKVersion(sdkVersionData.data);

        const packetVersion = getPacketVersionFromSDK(sdkVersion);

        await connection.afterOperation();
        return {
          sdkVersion,
          packetVersion,
        };
      } catch (error) {
        retries += 1;
        firstError = error as Error;
      }
    }

    await connection.afterOperation();
    throw firstError;
  }
}
