import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { sendData, receiveCommand } from './legacy';
import { isSDKSupported, getPacketVersionFromSDK } from './utils/sdkVersions';
import { PacketVersion, PacketVersionMap } from './utils/packetVersions';

const formatSDKVersion = (version: string) => {
  if (version.length < 12) {
    throw new Error('SDK version should be atleast 6 bytes.');
  }

  const major = parseInt(version.slice(0, 4), 16);
  const minor = parseInt(version.slice(4, 8), 16);
  const patch = parseInt(version.slice(8, 12), 16);

  return `${major}.${minor}.${patch}`;
};

export default class SDK {
  private version: string;

  private packetVersion: PacketVersion;

  private connection: IDeviceConnection;

  private isSDKSupported: boolean;

  private isNewer: boolean;

  private constructor(
    connection: IDeviceConnection,
    version: string,
    packetVersion: PacketVersion
  ) {
    this.connection = connection;
    this.version = version;
    this.packetVersion = packetVersion;
    const supportData = isSDKSupported(version);
    this.isSDKSupported = supportData.isSupported;
    this.isNewer = supportData.isNewer;
  }

  public static async create(connection: IDeviceConnection) {
    const sdkData = await SDK.getSDKVersion(connection);
    return new SDK(connection, sdkData.sdkVersion, sdkData.packetVersion);
  }

  public getVersion() {
    return this.version;
  }

  public isSupported() {
    return this.isSDKSupported;
  }

  public isSDKNewer() {
    return this.isNewer;
  }

  // public sendQuery({data: string; sequenceNumber: number, maxTries?: number}): Promise<void>;
  // public getResult({ sequenceNumber: number; }): Promise<Status | Result>;
  // public getStatus(): Promise<Status>;

  public async sendLegacyCommand(command: number, data: string) {
    return sendData(this.connection, command, data, PacketVersionMap.v1);
  }

  public async receiveLegacyCommand(commands: number[], timeout?: number) {
    return receiveCommand(
      this.connection,
      commands,
      PacketVersionMap.v1,
      timeout
    );
  }

  public getSequenceNumber() {
    return this.connection.getSequenceNumber();
  }

  public getNewSequenceNumber() {
    return this.connection.getNewSequenceNumber();
  }

  private static async getSDKVersion(connection: IDeviceConnection) {
    let retries = 0;
    const maxTries = 2;
    let firstError: Error = new Error('Could not get SDK version');

    await connection.beforeOperation();
    while (retries < maxTries) {
      try {
        await sendData(connection, 88, '00', PacketVersionMap.v1, 2);

        const sdkVersionData = await receiveCommand(
          connection,
          [88],
          PacketVersionMap.v1,
          5000
        );

        const sdkVersion = formatSDKVersion(sdkVersionData.data);

        const packetVersion = getPacketVersionFromSDK(sdkVersion);

        await connection.afterOperation();
        return {
          sdkVersion,
          packetVersion: packetVersion || PacketVersionMap.v1
        };
      } catch (error) {
        retries += 1;
        firstError = error as Error;
      }
    }

    await connection.afterOperation();
    throw firstError;
  }
}
