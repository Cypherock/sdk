import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';

export class BittensorApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 19;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, BittensorApp.APPLET_ID);
    return new BittensorApp(sdk);
  }

  public async getPublicKeys(params: operations.IGetPublicKeysParams) {
    return this.sdk.runOperation(() =>
      operations.getPublicKeys(this.sdk, params),
    );
  }

  public async getUserVerifiedPublicKey(
    params: operations.IGetUserVerifiedPublicKeyParams,
  ) {
    return this.sdk.runOperation(() =>
      operations.getUserVerifiedPublicKey(this.sdk, params),
    );
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
