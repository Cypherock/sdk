import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';
import * as operations from './operations';

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

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }
}
