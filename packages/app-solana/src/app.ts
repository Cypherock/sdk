import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';

export class SolanaApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 10; // Assuming Solana Applet ID is 10

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, SolanaApp.APPLET_ID);
    return new SolanaApp(sdk);
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
