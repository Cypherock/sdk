import SerialPort from 'serialport';
import * as uuid from 'uuid';
import { PoolData } from '@cypherock/sdk-interfaces';

// eslint-disable-next-line
export class DataListener {
  private readonly connection: SerialPort;

  private listening: boolean;

  private readonly pool: PoolData[];

  private readonly onCloseCallback?: () => void;

  private readonly onErrorCallback?: (err: Error) => void;

  constructor(params: {
    connection: SerialPort;
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
    this.listening = true;

    this.connection.addListener('data', this.onData.bind(this));
    this.connection.addListener('close', this.onClose.bind(this));
    this.connection.addListener('error', this.onSerialPortError.bind(this));
  }

  /**
   * Stop listening to all the events
   */
  private stopListening() {
    this.connection.removeListener('data', this.onData.bind(this));
    this.connection.removeListener('close', this.onClose.bind(this));
    this.connection.removeListener('error', this.onSerialPortError.bind(this));
    this.connection.removeAllListeners();

    this.listening = false;
  }

  private async onData(data: Buffer) {
    this.pool.push({ id: uuid.v4(), data: Uint8Array.from(data) });
  }

  private async onClose() {
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
  }

  private onSerialPortError(error: Error) {
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }
}
