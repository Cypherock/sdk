import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';

export class EvmApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 3;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, EvmApp.APPLET_ID);
    return new EvmApp(sdk);
  }

  public async getPublicKey(params: operations.IGetPublicKeysParams) {
    return this.sdk.runOperation(() =>
      operations.getPublicKeys(this.sdk, params),
    );
  }

  public async destroy() {
    return this.sdk.destroy();
  }
}
