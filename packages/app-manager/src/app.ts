import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';

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

  public async trainUser(onEvent?: operations.TrainUserEventHandler) {
    return this.sdk.runOperation(() => operations.trainUser(this.sdk, onEvent));
  }

  public async destroy() {
    return this.sdk.destroy();
  }
}
