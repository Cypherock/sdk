import {
  IDeviceConnection,
  DeviceState,
  ConnectionTypeMap,
} from '@cypherock/sdk-interfaces';
import * as uuid from 'uuid';

import { createPort, DataListener } from './helpers';

export default class DeviceConnection implements IDeviceConnection {
  protected deviceState: DeviceState;

  protected serial?: string;

  protected connectionId: string;

  protected sequenceNumber: number;

  protected connection: USBDevice;

  protected initialized: boolean;

  protected dataListener: DataListener;

  constructor(connection: USBDevice, dataListener: DataListener) {
    this.deviceState = DeviceState.MAIN;

    this.connectionId = uuid.v4();
    this.sequenceNumber = 0;
    this.dataListener = dataListener;

    this.connection = connection;
    this.initialized = true;
  }

  // eslint-disable-next-line
  public getConnectionType() {
    return ConnectionTypeMap.WEBUSB;
  }

  public static async connect(connection: USBDevice) {
    const dataListener = await DataListener.create(connection);
    return new DeviceConnection(connection, dataListener);
  }

  public static async create() {
    const connection = await createPort();
    return DeviceConnection.connect(connection);
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
    return this.connection.opened;
  }

  /**
   * Destroyes the connection and stop listening to the data.
   */
  public async destroy() {
    this.close();
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
    const sentData = await this.dataListener.send(data);
    console.log({ sentData });
    return sentData;
  }

  public async receive() {
    const recv = this.dataListener.receive();
    console.log({ recv: JSON.stringify(recv, undefined, 2) });
    return recv;
  }

  public async peek() {
    const peek = this.dataListener.peek();
    console.log({ peek: JSON.stringify(peek, undefined, 2) });
    return peek;
  }

  /**
   * Close the device connection
   */
  private close() {
    return this.connection.close();
  }
}
