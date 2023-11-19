import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';
import * as entityInfo from './proto/generated/mpc_poc/entity_info';

export class MPCApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 18;

  private static readonly COMPATIBLE_VERSION = {
    from: '1.0.0',
    to: '2.0.0',
  };

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, MPCApp.APPLET_ID);
    return new MPCApp(sdk);
  }

  public getSDKVersion() {
    return this.sdk.getVersion();
  }

  public isSupported() {
    return this.sdk.isSupported();
  }

  public async initApplication(params: operations.IInitApplicationParams) {
    return this.sdk.runOperation(() =>
      operations.initApplication(this.sdk, params),
    );
  }

  public async getRandomNonce() {
    return this.sdk.runOperation(() => operations.getRandomNonce(this.sdk));
  }

  public async verifyEntityInfo(params: operations.IVerifyEntityInfoParams) {
    return this.sdk.runOperation(() =>
      operations.verifyEntityInfo(this.sdk, params),
    );
  }

  public async signEntityInfo(params: operations.ISignEntityInfoParams) {
    return this.sdk.runOperation(() =>
      operations.signEntityInfo(this.sdk, params),
    );
  }

  public async getPublicKey(params: operations.IGetPublicKeyParams) {
    return this.sdk.runOperation(() =>
      operations.getPublicKey(this.sdk, params),
    );
  }

  public async exitApplication() {
    return this.sdk.runOperation(() => operations.exitApplication(this.sdk));
  }

  public async destroy() {
    return this.sdk.destroy();
  }

  public async abort() {
    await this.sdk.sendAbort();
  }

  public static createEntityInfo(
    timestamp: number,
    randomNonce: Uint8Array,
    threshold: number,
    totalParticipants: number,
    deviceId: Uint8Array,
    pubKey: Uint8Array,
    walletId: Uint8Array,
  ) {
    return entityInfo.EntityInfo.create({
      timestamp,
      randomNonce,
      threshold,
      totalParticipants,
      deviceId,
      pubKey,
      walletId,
    });
  }

  public static encodeEntityInfo(entityInfoArg: entityInfo.EntityInfo) {
    return entityInfo.EntityInfo.encode(entityInfoArg).finish();
  }

  public static decodeEntityInfo(encodedEntityInfo: Uint8Array) {
    return entityInfo.EntityInfo.decode(encodedEntityInfo);
  }
}
