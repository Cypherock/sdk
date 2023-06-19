import {
  DeviceAppError,
  DeviceAppErrorType,
  DeviceBootloaderError,
  DeviceBootloaderErrorType,
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  DeviceState,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

import * as bootloaderOperations from './operations/bootloader';
import * as legacyOperations from './operations/legacy';
import * as operations from './operations/proto';
import { getPacketVersionFromSDK, formatSDKVersion } from './utils/sdkVersions';
import { PacketVersion, PacketVersionMap } from './utils/packetVersions';
import { FeatureName, isFeatureEnabled } from './utils/featureMap';
import { ISDK } from './types';
import DeprecatedCommunication from './deprecated';
import { DeviceIdleState } from './encoders/proto/types';
import { DeviceIdleState as RawDeviceIdleState } from './encoders/raw';
import { logger } from './utils';

export class SDK implements ISDK {
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

  public static async create(
    connection: IDeviceConnection,
    appletId: number,
    options?: { maxTries?: number; timeout?: number },
  ) {
    const sdkData = await SDK.getSDKVersion(
      connection,
      options?.maxTries,
      options?.timeout,
    );
    return new SDK(
      connection,
      appletId,
      sdkData.sdkVersion,
      sdkData.packetVersion,
    );
  }

  public static async sendAbort(
    connection: IDeviceConnection,
    options?: {
      sequenceNumber?: number;
      maxTries?: number;
      timeout?: number;
    },
  ) {
    return operations.sendAbort({
      connection,
      sequenceNumber:
        options?.sequenceNumber ?? (await connection.getSequenceNumber()),
      version: PacketVersionMap.v3,
      maxTries: options?.maxTries,
      timeout: options?.timeout,
    });
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

  public async isSupported() {
    if ((await this.getDeviceState()) === DeviceState.BOOTLOADER) {
      return false;
    }

    return isFeatureEnabled(FeatureName.ProtoCommand, this.getVersion());
  }

  public async getSequenceNumber() {
    return this.connection.getSequenceNumber();
  }

  public async getNewSequenceNumber() {
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

  public async isInBootloader() {
    return (await this.getDeviceState()) === DeviceState.BOOTLOADER;
  }

  public async getDeviceState() {
    return this.connection.getDeviceState();
  }

  // ************** v3 Packet Version with protobuf ****************
  public async sendQuery(
    data: Uint8Array,
    options?: {
      sequenceNumber?: number;
      maxTries?: number;
      timeout?: number;
    },
  ): Promise<void> {
    await this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.sendQuery({
      connection: this.connection,
      data,
      appletId: this.appletId,
      sequenceNumber:
        options?.sequenceNumber ?? (await this.getNewSequenceNumber()),
      version: this.packetVersion,
      maxTries: options?.maxTries,
      timeout: options?.timeout,
    });
  }

  public async getResult(options?: {
    sequenceNumber?: number;
    maxTries?: number;
    timeout?: number;
  }) {
    await this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.getResult({
      connection: this.connection,
      appletId: this.appletId,
      sequenceNumber:
        options?.sequenceNumber ?? (await this.getSequenceNumber()),
      version: this.packetVersion,
      maxTries: options?.maxTries,
      timeout: options?.timeout,
    });
  }

  public async waitForResult(params?: {
    sequenceNumber?: operations.IWaitForCommandOutputParams['sequenceNumber'];
    onStatus?: operations.IWaitForCommandOutputParams['onStatus'];
    options?: operations.IWaitForCommandOutputParams['options'];
  }) {
    await this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.waitForResult({
      connection: this.connection,
      version: this.packetVersion,
      appletId: this.appletId,
      sequenceNumber:
        params?.sequenceNumber ?? (await this.getSequenceNumber()),
      onStatus: params?.onStatus,
      options: params?.options,
    });
  }

  public async getStatus(
    maxTries?: number,
    timeout?: number,
    dontLog?: boolean,
  ) {
    await this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.getStatus({
      connection: this.connection,
      version: this.packetVersion,
      maxTries,
      timeout,
      dontLog,
    });
  }

  public async sendAbort(options?: {
    sequenceNumber?: number;
    maxTries?: number;
    timeout?: number;
  }) {
    await this.validateNotInBootloaderMode();
    assert(
      this.packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.sendAbort({
      connection: this.connection,
      sequenceNumber:
        options?.sequenceNumber ?? (await this.getSequenceNumber()),
      version: this.packetVersion,
      maxTries: options?.maxTries,
      timeout: options?.timeout,
    });
  }

  // ************** Bootloader operations ****************
  public async sendBootloaderAbort(options?: {
    firstTimeout?: number;
    timeout?: number;
    maxTries?: number;
  }) {
    if (!(await this.isInBootloader())) {
      throw new DeviceBootloaderError(
        DeviceBootloaderErrorType.NOT_IN_BOOTLOADER,
      );
    }

    return bootloaderOperations.sendBootloaderAbort(this.connection, options);
  }

  public async sendBootloaderData(
    data: string,
    onProgress?: (progress: number) => void,
    options?: { firstTimeout?: number; timeout?: number; maxTries?: number },
  ) {
    if (!(await this.isInBootloader())) {
      throw new DeviceBootloaderError(
        DeviceBootloaderErrorType.NOT_IN_BOOTLOADER,
      );
    }

    return bootloaderOperations.sendBootloaderData(
      this.connection,
      data,
      onProgress,
      options,
    );
  }

  public async makeDeviceReady() {
    if (await this.isSupported()) {
      const status = await this.getStatus();
      if (status.deviceIdleState !== DeviceIdleState.DEVICE_IDLE_STATE_IDLE) {
        if (status.abortDisabled) {
          throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
        }

        await this.sendAbort();
      }
    } else if (await this.deprecated.isRawOperationSupported()) {
      const status = await this.deprecated.getCommandStatus();
      if (status.deviceIdleState !== RawDeviceIdleState.IDLE) {
        if (status.abortDisabled) {
          throw new DeviceAppError(DeviceAppErrorType.EXECUTING_OTHER_COMMAND);
        }

        await this.deprecated.sendCommandAbort(await this.getSequenceNumber());
      }
    }
  }

  public async runOperation<R>(operation: () => Promise<R>) {
    try {
      await this.connection.beforeOperation();
      await this.makeDeviceReady();

      const result = await operation();

      await this.ensureIfIdle();
      await this.connection.afterOperation();

      return result;
    } catch (error) {
      await this.ensureIfIdle();
      await this.connection.afterOperation();
      throw error;
    }
  }

  public async validateNotInBootloaderMode() {
    if (await this.isInBootloader()) {
      throw new DeviceCommunicationError(
        DeviceCommunicationErrorType.IN_BOOTLOADER,
      );
    }
  }

  private async ensureIfIdle() {
    try {
      if (await this.isSupported()) {
        await operations.waitForIdle({
          connection: this.connection,
          version: this.packetVersion ?? PacketVersionMap.v3,
        });
      }
    } catch (error) {
      logger.warn('Error while checking for idle state');
      logger.warn(error);
    }
  }

  private static async getSDKVersion(
    connection: IDeviceConnection,
    maxTries?: number,
    timeout?: number,
  ) {
    assert(connection, 'Invalid connection');

    if ((await connection.getDeviceState()) === DeviceState.BOOTLOADER) {
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
          timeout ?? 5000,
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
