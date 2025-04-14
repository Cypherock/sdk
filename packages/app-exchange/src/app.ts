import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

export class ExchnageApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 19;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, ExchnageApp.APPLET_ID);
    return new ExchnageApp(sdk);
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }
}
