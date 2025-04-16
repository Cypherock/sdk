import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';
import * as operations from './operations';

export class InheritanceApp {
  private readonly sdk: SDK;

  public static readonly APPLET_ID = 19;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, InheritanceApp.APPLET_ID);
    return new InheritanceApp(sdk);
  }

  public async encryptMessagesWithPin(
    params: operations.IEncryptMessagesWithPinParams,
  ) {
    return this.sdk.runOperation(() =>
      operations.encryptMessageWithPin(this.sdk, params),
    );
  }

  public async decryptMessagesWithPin(
    params: operations.IDecryptMessagesWithPinParams,
  ) {
    return this.sdk.runOperation(() =>
      operations.decryptMessagesWithPin(this.sdk, params),
    );
  }

  public async authWallet(params: operations.IAuthWalletParams) {
    return this.sdk.runOperation(() => operations.authWallet(this.sdk, params));
  }

  public async startSession() {
    return this.sdk.runOperation(() => this.sdk.startSession());
  }

  public async closeSession() {
    return this.sdk.runOperation(() => this.sdk.closeSession());
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }
}
