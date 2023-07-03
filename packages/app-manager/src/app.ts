import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';
import { firmwareService } from './services';
import { GetLatestFirmwareOptions } from './services/firmware';

export class ManagerApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 1;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, ManagerApp.APPLET_ID);
    return new ManagerApp(sdk);
  }

  public getSDKVersion() {
    return this.sdk.getVersion();
  }

  public isSupported() {
    return this.sdk.isSupported();
  }

  public async getDeviceInfo() {
    return this.sdk.runOperation(() => operations.getDeviceInfo(this.sdk));
  }

  public async getWallets() {
    return this.sdk.runOperation(() => operations.getWallets(this.sdk));
  }

  public async authDevice(onEvent?: operations.AuthDeviceEventHandler) {
    return this.sdk.runOperation(() =>
      operations.authDevice(this.sdk, onEvent),
    );
  }

  public async authCard(params?: operations.IAuthCardParams) {
    return this.sdk.runOperation(() => operations.authCard(this.sdk, params));
  }

  public async getLogs(onEvent?: operations.GetLogsEventHandler) {
    return this.sdk.runOperation(() => operations.getLogs(this.sdk, onEvent));
  }

  public async trainJoystick(onEvent?: operations.TrainJoystickEventHandler) {
    return this.sdk.runOperation(() =>
      operations.trainJoystick(this.sdk, onEvent),
    );
  }

  public async updateFirmware(params: operations.IUpdateFirmwareParams) {
    return this.sdk.runOperation(() =>
      operations.updateFirmware(this.sdk, params),
    );
  }

  public async trainCard(params: operations.ITrainCardParams) {
    return this.sdk.runOperation(() => operations.trainCard(this.sdk, params));
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public static async getLatestFirmware(params?: GetLatestFirmwareOptions) {
    return firmwareService.getLatest(params);
  }
}
