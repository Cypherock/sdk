import {
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import * as bootloaderOperations from './operations/bootloader';
import * as legacyOperations from './operations/legacy';
import * as operations from './operations/proto';
import * as rawOperations from './operations/raw';
import {
  isSDKSupported,
  getPacketVersionFromSDK,
  formatSDKVersion,
} from './utils/sdkVersions';
import { PacketVersion, PacketVersionMap } from './utils/packetVersions';
import assert from './utils/assert';
import { FeatureName, isFeatureEnabled } from './utils/featureMap';

export default class SDK {
  private readonly version: string;

  private readonly packetVersion: PacketVersion;

  private readonly connection: IDeviceConnection;

  private readonly isSDKSupported: boolean;

  private readonly isNewer: boolean;

  private readonly appletId: number;

  private constructor(
    connection: IDeviceConnection,
    version: string,
    packetVersion: PacketVersion,
    appletId: number,
  ) {
    this.connection = connection;
    this.version = version;
    this.packetVersion = packetVersion;
    this.appletId = appletId;

    const supportData = isSDKSupported(version);
    this.isSDKSupported = supportData.isSupported;
    this.isNewer = supportData.isNewer;
  }

  public static async create(connection: IDeviceConnection, appletId: number) {
    const sdkData = await SDK.getSDKVersion(connection);
    return new SDK(
      connection,
      sdkData.sdkVersion,
      sdkData.packetVersion,
      appletId,
    );
  }

  public getVersion() {
    return this.version;
  }

  public getPacketVersion() {
    return this.packetVersion;
  }

  public isSupported() {
    return this.isSDKSupported;
  }

  public isSDKNewer() {
    return this.isNewer;
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

  public destroy() {
    return this.connection.destroy();
  }

  // ************** v1/v2 Packet Version ****************
  public async sendLegacyCommand(
    command: number,
    data: string,
    maxTries?: number,
  ) {
    return legacyOperations.sendData(
      this.connection,
      command,
      data,
      this.packetVersion,
      maxTries,
    );
  }

  public async receiveLegacyCommand(commands: number[], timeout?: number) {
    return legacyOperations.receiveData(
      this.connection,
      commands,
      this.packetVersion,
      timeout,
    );
  }

  // ************** v3 Packet Version ****************
  public async sendCommand(params: {
    commandType: number;
    data: string;
    sequenceNumber: number;
    maxTries?: number;
  }): Promise<void> {
    if (!isFeatureEnabled(FeatureName.RawCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.sendCommand({
      connection: this.connection,
      data: params.data,
      commandType: params.commandType,
      sequenceNumber: params.sequenceNumber,
      version: this.packetVersion,
      maxTries: params.maxTries,
    });
  }

  public async getCommandOutput(sequenceNumber: number, maxTries?: number) {
    if (!isFeatureEnabled(FeatureName.RawCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.getCommandOutput({
      connection: this.connection,
      sequenceNumber,
      version: this.packetVersion,
      maxTries,
    });
  }

  public async waitForCommandOutput(params: {
    sequenceNumber: rawOperations.IWaitForCommandOutputParams['sequenceNumber'];
    expectedCommandTypes: rawOperations.IWaitForCommandOutputParams['expectedCommandTypes'];
    onStatus?: rawOperations.IWaitForCommandOutputParams['onStatus'];
    maxTries?: rawOperations.IWaitForCommandOutputParams['maxTries'];
    options?: rawOperations.IWaitForCommandOutputParams['options'];
  }) {
    if (!isFeatureEnabled(FeatureName.RawCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.waitForCommandOutput({
      connection: this.connection,
      version: this.packetVersion,
      ...params,
    });
  }

  public async getCommandStatus(maxTries?: number) {
    if (!isFeatureEnabled(FeatureName.RawCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.getStatus({
      connection: this.connection,
      version: this.packetVersion,
      maxTries
    });
  }

  public async sendCommandAbort(sequenceNumber: number, maxTries?: number) {
    if (!isFeatureEnabled(FeatureName.RawCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.sendAbort({
      connection: this.connection,
      version: this.packetVersion,
      sequenceNumber,
      maxTries,
    });
  }

  // ************** v3 Packet Version with protobuf ****************
  public async sendQuery(params: {
    data: Uint8Array;
    sequenceNumber: number;
    maxTries?: number;
  }): Promise<void> {
    if (!isFeatureEnabled(FeatureName.ProtoCommand, this.version)) {
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

  public async getResult(sequenceNumber: number) {
    if (!isFeatureEnabled(FeatureName.ProtoCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.getResult({
      connection: this.connection,
      appletId: this.appletId,
      sequenceNumber,
      version: this.packetVersion,
    });
  }

  public async waitForResult(params: {
    sequenceNumber: operations.IWaitForCommandOutputParams['sequenceNumber'];
    onStatus?: operations.IWaitForCommandOutputParams['onStatus'];
    maxTries?: operations.IWaitForCommandOutputParams['maxTries'];
    options?: operations.IWaitForCommandOutputParams['options'];
  }) {
    if (!isFeatureEnabled(FeatureName.ProtoCommand, this.version)) {
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

  public async getStatus() {
    if (!isFeatureEnabled(FeatureName.ProtoCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.getStatus({
      connection: this.connection,
      version: this.packetVersion,
    });
  }

  public async sendAbort(sequenceNumber: number) {
    if (!isFeatureEnabled(FeatureName.ProtoCommand, this.version)) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return operations.sendAbort({
      connection: this.connection,
      sequenceNumber,
      version: this.packetVersion,
    });
  }

  public sendBootloaderAbort() {
    return bootloaderOperations.sendBootloaderAbort(this.connection);
  }

  public sendBootloaderData(
    data: string,
    onProgress?: (progress: number) => void,
  ) {
    return bootloaderOperations.sendBootloaderData(
      this.connection,
      data,
      onProgress,
    );
  }

  public static async getSDKVersion(
    connection: IDeviceConnection,
    maxTries?: number,
    options?: { timeout?: number },
  ) {
    assert(connection, 'Invalid connection');

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
          packetVersion: packetVersion ?? PacketVersionMap.v1,
        };
      } catch (error) {
        retries += 1;
        firstError = error as Error;
      }
    }

    await connection.afterOperation();
    throw firstError;
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
}
