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

  public async destroy() {
    return this.sdk.destroy();
  }
}
