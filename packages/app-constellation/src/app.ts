import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';
import { SignMsgType } from './types';

export class ConstellationApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 23;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, ConstellationApp.APPLET_ID);
    return new ConstellationApp(sdk);
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

  public async blindSign(
    params: Omit<operations.ISignMsgParams, 'messageType'>,
  ) {
    return this.sdk.runOperation(() =>
      operations.signMsg(this.sdk, {
        ...params,
        messageType: SignMsgType.SIGN_MSG_TYPE_BLIND_SIGN,
      }),
    );
  }

  public async signMsg(params: Omit<operations.ISignMsgParams, 'messageType'>) {
    return this.sdk.runOperation(() =>
      operations.signMsg(this.sdk, {
        ...params,
        messageType: SignMsgType.SIGN_MSG_TYPE_SIGN_TYPED_MSG,
      }),
    );
  }

  public async signData(
    params: Omit<operations.ISignMsgParams, 'messageType'>,
  ) {
    return this.sdk.runOperation(() =>
      operations.signMsg(this.sdk, {
        ...params,
        messageType: SignMsgType.SIGN_MSG_TYPE_SIGN_ARBITRARY_DATA,
      }),
    );
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }
}
