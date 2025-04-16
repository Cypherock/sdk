import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';
import * as operations from './operations';

export class ExchangeApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 19;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, ExchangeApp.APPLET_ID);
    return new ExchangeApp(sdk);
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }

  public async initiateFlow(params: operations.IInitiateFlowParams) {
    return this.sdk.runOperation(() =>
      operations.initiateFlow(this.sdk, params),
    );
  }

  public async getSignature() {
    return this.sdk.runOperation(() => operations.getSignature(this.sdk));
  }

  public async storeSignature(params: operations.IStoreSignatureParams) {
    return this.sdk.runOperation(() =>
      operations.storeSignature(this.sdk, params),
    );
  }
}
