import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import SerialPort from 'serialport';
import * as uuid from 'uuid';

import { IConnectionInfo } from './types';
import { closeConnection, openConnection } from './utils';
import { createPort } from './connection';

export default class DeviceConnection implements IDeviceConnection {
  private port: string;

  private deviceState: string;

  private inBootloader: boolean;

  private hardwareVersion: string;

  private serial?: string;

  private connectionId: string;

  private sequenceNumber: number;

  private connection: SerialPort;

  private initialized: boolean;

  constructor(connectionInfo: IConnectionInfo) {
    this.port = connectionInfo.port.path;
    this.deviceState = connectionInfo.deviceState;
    this.inBootloader = connectionInfo.inBootloader;
    this.hardwareVersion = connectionInfo.hardwareVersion;
    this.serial = connectionInfo.serial;

    this.connectionId = uuid.v4();
    this.sequenceNumber = 0;

    this.connection = new SerialPort(this.port, {
      baudRate: 115200,
      autoOpen: false
    });
    this.initialized = true;
  }

  public static async create() {
    const connectionInfo = await createPort();
    return new DeviceConnection(connectionInfo);
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
    return this.connection && !this.connection.destroyed;
  }

  /**
   * Destroyes the connection and stop listening to the data.
   */
  public async destroy() {
    // this.stopListening();
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
  public send(data: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        this.connection.write(Buffer.from(data, 'hex'), error => {
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

  /**
   * Writes a given data string (in hex) to the device.
   */
  public async receive(_timeout?: number) {
    return this.hardwareVersion;
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
