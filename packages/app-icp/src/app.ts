import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';

export class IcpApp {
  private readonly sdk: SDK;

  public static readonly APPLET_ID = 22;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, IcpApp.APPLET_ID);
    return new IcpApp(sdk);
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
