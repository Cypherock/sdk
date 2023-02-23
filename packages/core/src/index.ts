import { IDeviceConnection, ISdk } from '@cypherock/sdk-interfaces';
import * as legacyOperations from './operations/legacy';
import * as operations from './operations/proto';
import * as rawOperations from './operations/raw';
import { isSDKSupported, getPacketVersionFromSDK, formatSDKVersion } from './utils/sdkVersions';
import { PacketVersion, PacketVersionMap } from './utils/packetVersions';

export default class SDK implements ISdk {
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

  public async sendLegacyCommand(command: number, data: string) {
    return legacyOperations.sendData(this.connection, command, data, PacketVersionMap.v1);
  }

  public async receiveLegacyCommand(commands: number[], timeout?: number) {
    return legacyOperations.receiveCommand(
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

  public async sendCommand(params: {
    commandType: number;
    data: string;
    sequenceNumber: number;
    maxTries?: number;
  }): Promise<void> {
    await rawOperations.sendCommand({
      connection: this.connection,
      data: params.data,
      commandType: params.commandType,
      sequenceNumber: params.sequenceNumber,
      version: this.packetVersion,
      maxTries: params.maxTries
    });
  }

  public async getCommandOutput(sequenceNumber: number) {
    const resp = await rawOperations.getCommandOutput({
      connection: this.connection,
      sequenceNumber,
      version: this.packetVersion
    });

    if (!resp) {
      throw new Error('Did not receive the expected data');
    }

    return resp;
  }

  public async waitForCommandOutput(params: {
    sequenceNumber: rawOperations.IWaitForCommandOutputParams['sequenceNumber'];
    expectedCommandTypes: rawOperations.IWaitForCommandOutputParams['expectedCommandTypes'];
    onStatus: rawOperations.IWaitForCommandOutputParams['onStatus'];
    maxTries?: rawOperations.IWaitForCommandOutputParams['maxTries'];
    options?: rawOperations.IWaitForCommandOutputParams['options'];
  }) {
    const resp = await rawOperations.waitForCommandOutput({
      connection: this.connection,
      version: this.packetVersion,
      ...params
    });

    return resp;
  }

  public getStatus() {
    return operations.getStatus({
      connection: this.connection,
      version: this.packetVersion
    });
  }

  private static async getSDKVersion(connection: IDeviceConnection) {
    let retries = 0;
    const maxTries = 2;
    let firstError: Error = new Error('Could not get SDK version');

    await connection.beforeOperation();
    while (retries < maxTries) {
      try {
        await legacyOperations.sendData(connection, 88, '00', PacketVersionMap.v1, 2);

        const sdkVersionData = await legacyOperations.receiveCommand(
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
