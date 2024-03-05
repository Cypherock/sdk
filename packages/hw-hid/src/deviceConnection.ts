/* eslint-disable class-methods-use-this */
import {
  IDeviceConnection,
  IDevice,
  ConnectionTypeMap,
  DeviceConnectionError,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';
import HID from 'node-hid';
import * as uuid from 'uuid';

import { getAvailableDevices, DataListener } from './helpers';
import { logger } from './logger';

export default class DeviceConnection implements IDeviceConnection {
  protected connectionId: string;

  protected sequenceNumber: number;

  protected connection: HID.HIDAsync;

  protected initialized: boolean;

  protected dataListener: DataListener;

  protected isPortOpen: boolean;

  private readonly device: IDevice;

  constructor(device: IDevice, connection: HID.HIDAsync) {
    this.device = { ...device };
    this.connectionId = uuid.v4();
    this.sequenceNumber = 0;

    this.initialized = true;
    this.isPortOpen = true;
    this.connection = connection;
    this.dataListener = new DataListener({
      device: this.device,
      connection: this.connection,
      onClose: this.onClose.bind(this),
      onError: this.onError.bind(this),
    });
  }

  public async getConnectionType() {
    return ConnectionTypeMap.HID;
  }

  public static async connect(device: IDevice) {
    const connection = await HID.HIDAsync.open(device.path);
    return new DeviceConnection(device, connection);
  }

  public static async list() {
    return getAvailableDevices();
  }

  public static async create() {
    const devices = await getAvailableDevices();

    if (devices.length <= 0)
      throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);

    const connection = await HID.HIDAsync.open(devices[0].path);
    return new DeviceConnection(devices[0], connection);
  }

  public static async getAvailableConnection() {
    const connectionInfo = await getAvailableDevices();
    return connectionInfo;
  }

  public async getDeviceState() {
    return this.device.deviceState;
  }

  public async isInitialized() {
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
    return this.isPortOpen;
  }

  /**
   * Destroyes the connection and stop listening to the data.
   */
  public async destroy() {
    if (!this.isPortOpen) return;

    await this.dataListener.destroy();
    try {
      await this.connection.close();
    } catch (error) {
      logger.warn('Error while closing device connection');
      logger.warn(error);
    }
  }

  /**
   * Run this function before starting every operation on the device.
   */
  // eslint-disable-next-line
  public async beforeOperation() {
    this.dataListener.startListening();
  }

  /**
   * Run this function after every operation on the device.
   */
  // eslint-disable-next-line
  public async afterOperation() {
    this.dataListener.stopListening();
  }

  /**
   * Writes a given data string (in hex) to the device.
   */
  public async send(data: Uint8Array) {
    const dataToWrite = [
      0x00,
      ...data,
      ...new Array(64 - data.length).fill(0x00),
    ];
    await this.connection.write(Buffer.from(dataToWrite));
  }

  public async receive() {
    return this.dataListener.receive();
  }

  public async peek() {
    return this.dataListener.peek();
  }

  private onClose() {
    this.isPortOpen = false;
  }

  private onError(error: Error) {
    logger.error('Error on device connection callback');
    logger.error(error);
  }
}
