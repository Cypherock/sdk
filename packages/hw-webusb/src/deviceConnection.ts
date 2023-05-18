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
  public async getConnectionType() {
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

  public async getDeviceState() {
    return this.deviceState;
  }

  public isInitialized() {
    return this.initialized;
  }

  public async getNewSequenceNumber() {
    this.sequenceNumber += 1;
    return this.sequenceNumber;
  }

  public async getSequenceNumber() {
    return this.sequenceNumber;
  }

  /**
   * Returns if the device is connected or not
   */
  public async isConnected() {
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
  public send(data: Uint8Array) {
    return this.dataListener.send(data);
  }

  public async receive() {
    return this.dataListener.receive();
  }

  public async peek() {
    return this.dataListener.peek();
  }

  /**
   * Close the device connection
   */
  private close() {
    return this.connection.close();
  }
}
