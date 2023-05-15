import {
  IDeviceConnection,
  DeviceState,
  ConnectionTypeMap,
  IDevice,
  DeviceConnectionError,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';
import SerialPort from 'serialport';
import * as uuid from 'uuid';

import {
  getAvailableDevices,
  closeConnection,
  openConnection,
  DataListener,
} from './helpers';

export default class DeviceConnection implements IDeviceConnection {
  protected port: string;

  protected deviceState: DeviceState;

  protected serial?: string;

  protected connectionId: string;

  protected sequenceNumber: number;

  protected connection: SerialPort;

  protected initialized: boolean;

  protected dataListener: DataListener;

  constructor(device: IDevice) {
    this.port = device.path;
    this.deviceState = device.deviceState;
    this.serial = device.serial;

    this.connectionId = uuid.v4();
    this.sequenceNumber = 0;

    this.connection = new SerialPort(this.port, {
      baudRate: 115200,
      autoOpen: false,
    });
    this.initialized = true;
    this.dataListener = new DataListener({ connection: this.connection });
  }

  // eslint-disable-next-line
  public getConnectionType() {
    return ConnectionTypeMap.SERIAL_PORT;
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
    return !this.connection.destroyed;
  }

  /**
   * Destroyes the connection and stop listening to the data.
   */
  public async destroy() {
    this.dataListener.destroy();
    this.close();
    this.connection.destroy();
  }

  /**
   * Run this function before starting every operation on the device.
   */
  public async beforeOperation() {
    this.open();
  }

  /**
   * Run this function after every operation on the device.
   */
  public async afterOperation() {
    await this.close();
  }

  /**
   * Writes a given data string (in hex) to the device.
   */
  public send(data: Uint8Array) {
    return new Promise<void>((resolve, reject) => {
      try {
        this.connection.write(Buffer.from(data), error => {
          if (error) {
            reject(error);
            return;
          }

          // Wait for the write to be completed
          this.connection.drain(err => {
            if (err) {
              reject(err);
              return;
            }

            resolve();
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public async receive() {
    return this.dataListener.receive();
  }

  public async peek() {
    return this.dataListener.peek();
  }

  /**
   * Returns if the device connection is open, i.e., if it's ready to communicate.
   */
  private isOpen() {
    return this.isConnected() && this.connection.isOpen;
  }

  /**
   * Open the device connection
   */
  private open() {
    if (this.isOpen()) {
      return;
    }

    openConnection(this.connection);
  }

  /**
   * Close the device connection
   */
  private close() {
    return closeConnection(this.connection);
  }
}
