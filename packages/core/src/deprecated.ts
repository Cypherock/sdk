import {
  DeviceCompatibilityError,
  DeviceCompatibilityErrorType,
  DeviceState,
} from '@cypherock/sdk-interfaces';
import { assert } from '@cypherock/sdk-utils';

import * as legacyOperations from './operations/legacy';
import * as rawOperations from './operations/raw';
import { PacketVersionMap } from './utils/packetVersions';
import { FeatureName, isFeatureEnabled } from './utils/featureMap';
import { ISDK } from './types';

export default class DeprecatedCommunication {
  private readonly sdk: ISDK;

  public constructor(sdk: ISDK) {
    this.sdk = sdk;
  }

  public async isLegacyOperationSupported() {
    const packetVersion = this.sdk.getPacketVersion();

    if (!packetVersion) return false;

    if ((await this.sdk.getDeviceState()) === DeviceState.BOOTLOADER) {
      return false;
    }

    return [PacketVersionMap.v1, PacketVersionMap.v2].includes(packetVersion);
  }

  public async isRawOperationSupported() {
    if ((await this.sdk.getDeviceState()) === DeviceState.BOOTLOADER) {
      return false;
    }

    return isFeatureEnabled(FeatureName.RawCommand, this.sdk.getVersion());
  }

  // ************** v1/v2 Packet Version ****************
  public async sendLegacyCommand(
    command: number,
    data: string,
    maxTries?: number,
    timeout?: number,
  ) {
    await this.sdk.validateNotInBootloaderMode();
    const packetVersion = this.sdk.getPacketVersion();

    assert(
      packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    return legacyOperations.sendData(
      this.sdk.getConnection(),
      command,
      data,
      packetVersion,
      maxTries,
      timeout,
    );
  }

  public async receiveLegacyCommand(commands: number[], timeout?: number) {
    await this.sdk.validateNotInBootloaderMode();
    const packetVersion = this.sdk.getPacketVersion();

    assert(
      packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    return legacyOperations.receiveData(
      this.sdk.getConnection(),
      commands,
      packetVersion,
      timeout,
    );
  }

  // ************** v3 Packet Version ****************
  public async sendCommand(params: {
    commandType: number;
    data: string;
    sequenceNumber: number;
    maxTries?: number;
    timeout?: number;
  }): Promise<void> {
    await this.sdk.validateNotInBootloaderMode();
    const packetVersion = this.sdk.getPacketVersion();

    assert(
      packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isRawOperationSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.sendCommand({
      connection: this.sdk.getConnection(),
      data: params.data,
      commandType: params.commandType,
      sequenceNumber: params.sequenceNumber,
      version: packetVersion,
      maxTries: params.maxTries,
      timeout: params.timeout,
    });
  }

  public async getCommandOutput(
    sequenceNumber: number,
    maxTries?: number,
    timeout?: number,
  ) {
    await this.sdk.validateNotInBootloaderMode();
    const packetVersion = this.sdk.getPacketVersion();

    assert(
      packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isRawOperationSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.getCommandOutput({
      connection: this.sdk.getConnection(),
      sequenceNumber,
      version: packetVersion,
      maxTries,
      timeout,
    });
  }

  public async waitForCommandOutput(params: {
    sequenceNumber: rawOperations.IWaitForCommandOutputParams['sequenceNumber'];
    expectedCommandTypes: rawOperations.IWaitForCommandOutputParams['expectedCommandTypes'];
    onStatus?: rawOperations.IWaitForCommandOutputParams['onStatus'];
    options?: rawOperations.IWaitForCommandOutputParams['options'];
  }) {
    await this.sdk.validateNotInBootloaderMode();
    const packetVersion = this.sdk.getPacketVersion();

    assert(
      packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isRawOperationSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.waitForCommandOutput({
      connection: this.sdk.getConnection(),
      version: packetVersion,
      ...params,
    });
  }

  public async getCommandStatus(maxTries?: number, timeout?: number) {
    await this.sdk.validateNotInBootloaderMode();
    const packetVersion = this.sdk.getPacketVersion();

    assert(
      packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isRawOperationSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.getStatus({
      connection: this.sdk.getConnection(),
      version: packetVersion,
      maxTries,
      timeout,
    });
  }

  public async sendCommandAbort(
    sequenceNumber: number,
    maxTries?: number,
    timeout?: number,
  ) {
    await this.sdk.validateNotInBootloaderMode();
    const packetVersion = this.sdk.getPacketVersion();

    assert(
      packetVersion,
      new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED,
      ),
    );

    if (!(await this.isRawOperationSupported())) {
      throw new DeviceCompatibilityError(
        DeviceCompatibilityErrorType.INVALID_SDK_OPERATION,
      );
    }

    return rawOperations.sendAbort({
      connection: this.sdk.getConnection(),
      version: packetVersion,
      sequenceNumber,
      maxTries,
      timeout,
    });
  }
}
