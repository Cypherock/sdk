import { IDeviceConnection } from '@cypherock/sdk-interfaces';

export default class SDK {
  private version: string;

  private packetVersion: string;

  private connection: IDeviceConnection;

  private constructor(
    connection: IDeviceConnection,
    version: string,
    packetVersion: string
  ) {
    this.connection = connection;
    this.version = version;
    this.packetVersion = packetVersion;
  }

  public static async create(connected: IDeviceConnection) {
    return new SDK(connected, '', '');
  }

  // public sendQuery({data: string; sequenceNumber: number, maxTries?: number}): Promise<void>;
  // public getResult({ sequenceNumber: number; }): Promise<Status | Result>;
  // public getStatus(): Promise<Status>;

  public getSequenceNumber() {
    return this.connection.getSequenceNumber();
  }

  public getNewSequenceNumber() {
    return this.connection.getNewSequenceNumber();
  }
}
