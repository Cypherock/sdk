import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';

export class BtcApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 2;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, BtcApp.APPLET_ID);
    return new BtcApp(sdk);
  }

  public async getPublicKey(params: operations.IGetPublicKeyParams) {
    return this.sdk.runOperation(() =>
      operations.getPublicKey(this.sdk, params),
    );
  }

  public async getXpubs(params: operations.IGetXpubsParams) {
    return this.sdk.runOperation(() => operations.getXpubs(this.sdk, params));
  }

  public async signTxn(params: operations.ISignTxnParams) {
    return this.sdk.runOperation(() => operations.signTxn(this.sdk, params));
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }
}
