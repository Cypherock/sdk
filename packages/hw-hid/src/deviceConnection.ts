import {
  IDeviceConnection,
  DeviceState,
  ConnectionTypeMap,
} from '@cypherock/sdk-interfaces';
import HID from 'node-hid';
import * as uuid from 'uuid';

import {
  createPort,
  getAvailableConnectionInfo,
  DataListener,
  formatDeviceInfo,
} from './helpers';
import { IConnectionInfo } from './types';

export default class DeviceConnection implements IDeviceConnection {
  protected path: string;

  protected deviceState: DeviceState;

  protected connectionId: string;

  protected sequenceNumber: number;

  protected connection: HID.HID;

  protected initialized: boolean;

  protected dataListener: DataListener;

  protected isPortOpen: boolean;

  constructor(connectionInfo: IConnectionInfo) {
    this.path = connectionInfo.path;
    this.deviceState = connectionInfo.deviceState;

    this.connectionId = uuid.v4();
    this.sequenceNumber = 0;

    this.connection = new HID.HID(this.path);
    this.initialized = true;
    this.isPortOpen = true;
    this.dataListener = new DataListener({
      connection: this.connection,
      onClose: this.onClose.bind(this),
    });
  }

  // eslint-disable-next-line
  public getConnectionType() {
    return ConnectionTypeMap.SERIAL_PORT;
  }

  public static async connect(device: HID.Device) {
    const connectionInfo = formatDeviceInfo(device);

    if (!connectionInfo) {
      throw new Error('Invalid device');
    }

    return new DeviceConnection(connectionInfo);
  }

  public static async create() {
    const connectionInfo = await createPort();
    return new DeviceConnection(connectionInfo);
  }

  public static async getAvailableConnection() {
    const connectionInfo = await getAvailableConnectionInfo();
    return connectionInfo;
  }

  public getDeviceState() {
    return this.deviceState;
  }

  public isInitialized() {
    return this.initialized;
  }

  public getNewSequenceNumber() {
    this.sequenceNumber += 1;
    return this.sequenceNumber;
  }

  public getSequenceNumber() {
    return this.sequenceNumber;
  }

  /**
   * Returns if the device is connected or not
   */
  public isConnected() {
    return this.isPortOpen;
  }

  /**
   * Destroyes the connection and stop listening to the data.
   */
  public async destroy() {
    this.dataListener.destroy();
    this.connection.close();
  }

  /**
   * Run this function before starting every operation on the device.
   */
  // eslint-disable-next-line
  public async beforeOperation() {
    // Do nothing
  }

  /**
   * Run this function after every operation on the device.
   */
  // eslint-disable-next-line
  public async afterOperation() {
    // Do nothing
  }

  /**
   * Writes a given data string (in hex) to the device.
   */
  public async send(data: Uint8Array) {
    this.connection.write(Buffer.from([0x00, ...data]));
    console.log({ data });
  }

  public async receive() {
    const recv = await this.dataListener.receive();
    console.log({ recv: JSON.stringify(recv, undefined, 2) });
    return recv;
  }

  public async peek() {
    const peek = await this.dataListener.peek();
    console.log({ peek: JSON.stringify(peek, undefined, 2) });
    return peek;
  }

  private onClose() {
    this.isPortOpen = false;
  }
}
