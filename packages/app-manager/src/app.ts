import {
  DeviceAppError,
  DeviceAppErrorType,
  IDeviceConnection,
} from '@cypherock/sdk-interfaces';
import SDK from '@cypherock/sdk-core';
import { Query, Result } from './proto/generated/manager/core';

export class ManagerApp {
  private readonly sdk: SDK;

  private static readonly APPLET_ID = 1;

  private constructor(sdk: SDK) {
    this.sdk = sdk;
  }

  public static async create(connection: IDeviceConnection) {
    const sdk = await SDK.create(connection, ManagerApp.APPLET_ID);
    return new ManagerApp(sdk);
  }

  public async getDeviceInfo() {
    return this.sdk.wrapOperation(async () => {
      const sequenceNumber = this.sdk.getNewSequenceNumber();
      const query = Query.encode(
        Query.create({ getDeviceInfo: { dummy: true } }),
      ).finish();

      await this.sdk.sendQuery({
        data: Uint8Array.from(query),
        sequenceNumber,
      });

      const data = await this.sdk.waitForResult({
        sequenceNumber,
      });

      let result: Result;
      try {
        result = Result.decode(data);
      } catch (error) {
        throw new DeviceAppError(DeviceAppErrorType.INVALID_RESULT);
      }

      if (!result.getDeviceInfo) {
        throw new DeviceAppError(DeviceAppErrorType.INVALID_RESULT);
      }

      return result.getDeviceInfo;
    });
  }

  public async destroy() {
    return this.sdk.destroy();
  }
}
