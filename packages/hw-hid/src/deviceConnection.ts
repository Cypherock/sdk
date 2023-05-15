import {
  IDeviceConnection,
  DeviceState,
  IDevice,
  ConnectionTypeMap,
  DeviceConnectionError,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';
import HID from 'node-hid';
import * as uuid from 'uuid';

import { getAvailableDevices, DataListener } from './helpers';

export default class DeviceConnection implements IDeviceConnection {
  protected path: string;

  protected deviceState: DeviceState;

  protected connectionId: string;

  protected sequenceNumber: number;

  protected connection: HID.HID;

  protected initialized: boolean;

  protected dataListener: DataListener;

  protected isPortOpen: boolean;

  constructor(device: IDevice) {
    this.path = device.path;
    this.deviceState = device.deviceState;

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
    return ConnectionTypeMap.HID;
  }

  public static async connect(device: IDevice) {
    return new DeviceConnection(device);
  }

  public static async list() {
    return getAvailableDevices();
  }

  public static async create() {
    const devices = await getAvailableDevices();

    if (devices.length <= 0)
      throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);

    return new DeviceConnection(devices[0]);
  }

  public static async getAvailableConnection() {
    const connectionInfo = await getAvailableDevices();
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
}
