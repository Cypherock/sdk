import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';
import { ISignPersonalMsgParams } from './types';
import { SignMsgType } from './proto/generated/types';

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

  public async getPublicKeys(params: operations.IGetPublicKeysParams) {
    return this.sdk.runOperation(() =>
      operations.getPublicKeys(this.sdk, params),
    );
  }

  public async signTxn(params: operations.ISignTxnParams) {
    return this.sdk.runOperation(() => operations.signTxn(this.sdk, params));
  }

  public async signPersonalMsg(params: ISignPersonalMsgParams) {
    return this.sdk.runOperation(() =>
      operations.signMsg(this.sdk, {
        ...params,
        messageType: SignMsgType.SIGN_MSG_TYPE_PERSONAL_SIGN,
      }),
    );
  }

  public async destroy() {
    return this.sdk.destroy();
  }
}
