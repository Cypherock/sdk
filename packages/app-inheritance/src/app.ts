import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';
import * as operations from './operations';

// import * as operations from './operations';

export class InheritanceApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 19;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, InheritanceApp.APPLET_ID);
    return new InheritanceApp(sdk);
  }

  public async getWalletSign() {
    return this.sdk.runOperation(() => operations.getWalletSign(this.sdk));
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }
}
