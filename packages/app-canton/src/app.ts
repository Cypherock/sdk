import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

// import * as operations from './operations';

export class CantonApp {
  private readonly sdk: SDK;

  public static readonly APPLET_ID = 26;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, CantonApp.APPLET_ID);
    return new CantonApp(sdk);
  }

  public async getPublicKeys(params: any) {
    return this.sdk.runOperation(() => {
      throw new Error(`Method not implemented: ${params}`);
    });
  }

  public async getUserVerifiedPublicKey(params: any) {
    return this.sdk.runOperation(() => {
      throw new Error(`Method not implemented: ${params}`);
    });
  }

  public async signTxn(params: any) {
    return this.sdk.runOperation(() => {
      throw new Error(`Method not implemented: ${params}`);
    });
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }
}
