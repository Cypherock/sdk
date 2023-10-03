import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import { assert, hexToUint8Array, isHex } from '@cypherock/sdk-utils';
import * as operations from './operations';
import { ISignPersonalMsgParams, ISignTypedParams } from './types';
import { SignMsgType } from './proto/generated/types';
import { SignTypedDataStruct } from './proto/generated/evm/sign_msg';
import { eip712JsonToStruct } from './utils';

export class EvmApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 7;

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

  public async signPersonalMsg(params: ISignPersonalMsgParams) {
    assert(params, 'params should be defined');
    assert(params.message, 'message should be defined');
    assert(isHex(params.message), 'message should be a valid hex');

    return this.sdk.runOperation(() =>
      operations.signMsg(this.sdk, {
        ...params,
        message: hexToUint8Array(params.message),
        messageType: SignMsgType.SIGN_MSG_TYPE_PERSONAL_SIGN,
      }),
    );
  }

  public async signEthMsg(params: ISignPersonalMsgParams) {
    assert(params, 'params should be defined');
    assert(params.message, 'message should be defined');
    assert(isHex(params.message), 'message should be a valid hex');

    return this.sdk.runOperation(() =>
      operations.signMsg(this.sdk, {
        ...params,
        message: hexToUint8Array(params.message),
        messageType: SignMsgType.SIGN_MSG_TYPE_ETH_SIGN,
      }),
    );
  }

  public async signTypedMsg(params: ISignTypedParams) {
    assert(params, 'params should be defined');
    assert(params.message, 'message should be defined');
    assert(
      typeof params.message === 'object',
      'message should be a valid json object',
    );
    assert(params.message, 'message should be a valid eip712 json object');
    assert(
      params.message.message,
      'message should be a valid eip712 json object',
    );

    return this.sdk.runOperation(() =>
      operations.signMsg(this.sdk, {
        ...params,
        message: SignTypedDataStruct.encode(
          eip712JsonToStruct(params.message),
        ).finish(),
        messageType: SignMsgType.SIGN_MSG_TYPE_SIGN_TYPED_DATA,
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
