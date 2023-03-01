import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import SDK from '@cypherock/sdk-core';
import { Query, Result } from './proto/generated/manager/core';

export default class ManagerApp {
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
    const sequenceNumber = this.sdk.getNewSequenceNumber();
    const query = Query.encode(
      Query.create({ getDeviceInfo: { dummy: true } })
    ).finish();

    await this.sdk.sendQuery({
      data: query,
      sequenceNumber
    });

    const data = await this.sdk.waitForResult({
      sequenceNumber,
      onStatus: () => {
        // empty
      }
    });

    const result = Result.decode(data);

    if (!result.getDeviceInfo) {
      throw new Error('Invalid data');
    }

    return result.getDeviceInfo;
  }
}
