import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { SDK } from '@cypherock/sdk-core';

import * as operations from './operations';
import * as common from './proto/generated/mpc_poc/common';

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

  public async getPublicKey(params: operations.IGetPublicKeyParams) {
    return this.sdk.runOperation(() =>
      operations.getPublicKey(this.sdk, params),
    );
  }

  public async dummy(params: operations.IDummyParams) {
    return this.sdk.runOperation(() => operations.dummy(this.sdk, params));
  }

  public async groupSetup(params: operations.IGroupSetupParams) {
    return this.sdk.runOperation(() => operations.groupSetup(this.sdk, params));
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
    const participantDeviceInfo = common.ParticipantDeviceInfo.create({
      deviceId,
      pubKey,
      walletId,
    });
    return common.EntityInfo.create({
      timestamp,
      randomNonce,
      threshold,
      totalParticipants,
      deviceInfo: participantDeviceInfo,
    });
  }

  public static encodeEntityInfo(entityInfoArg: common.EntityInfo) {
    return common.EntityInfo.encode(entityInfoArg).finish();
  }

  public static decodeEntityInfo(encodedEntityInfo: Uint8Array) {
    return common.EntityInfo.decode(encodedEntityInfo);
  }
}
