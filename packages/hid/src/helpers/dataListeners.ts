import HID from 'node-hid';
import * as uuid from 'uuid';
import { PoolData } from '@cypherock/sdk-interfaces';

// eslint-disable-next-line
export class DataListener {
  private connection: HID.HID;

  private listening: boolean;

  private pool: PoolData[];

  private onCloseCallback?: () => void;

  private onErrorCallback?: (err: Error) => void;

  constructor(params: {
    connection: HID.HID;
    onClose?: () => void;
    onError?: (err: Error) => void;
  }) {
    this.connection = params.connection;
    this.onCloseCallback = params.onClose;
    this.onErrorCallback = params.onError;

    this.listening = false;
    this.pool = [];
    this.startListening();
  }

  public destroy() {
    this.stopListening();
  }

  public isListening() {
    return this.listening;
  }

  public async receive() {
    return this.pool.shift()?.data;
  }

  public peek() {
    return [...this.pool];
  }

  /**
   * Starts listening to all the events
   */
  private startListening() {
    console.log('Started listening');
    this.listening = true;

    this.connection.addListener('data', this.onData.bind(this));
    this.connection.addListener('close', this.onClose.bind(this));
    this.connection.addListener('error', this.onSerialPortError.bind(this));
  }

  /**
   * Stop listening to all the events
   */
  private stopListening() {
    console.log('Stopped listening');
    if (this.connection) {
      this.connection.removeListener('data', this.onData.bind(this));
      this.connection.removeListener('close', this.onClose.bind(this));
      this.connection.removeListener(
        'error',
        this.onSerialPortError.bind(this)
      );
      this.connection.removeAllListeners();
    }

    this.listening = false;
  }

  private async onData(data: Buffer) {
    console.log({ data, pool: this.pool });
    this.pool.push({ id: uuid.v4(), data: Uint8Array.from(data) });
  }

  private async onClose() {
    console.log('Connection closed');
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  private onSerialPortError(error: any) {
    console.log('Serialport error');
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }
}
