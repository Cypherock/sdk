import HID from 'node-hid';
import * as uuid from 'uuid';
import { usb } from 'usb';
import { IDevice, PoolData } from '@cypherock/sdk-interfaces';
import { getAvailableDevices } from './connection';

// eslint-disable-next-line
export class DataListener {
  private readonly connection: HID.HID;

  private readonly device: IDevice;

  private listening: boolean;

  private readonly pool: PoolData[];

  private readonly onCloseCallback?: () => void;

  private readonly onErrorCallback?: (err: Error) => void;

  private readonly onSomeDeviceDisconnectBinded: (device: usb.Device) => void;

  constructor(params: {
    connection: HID.HID;
    device: IDevice;
    onClose?: () => void;
    onError?: (err: Error) => void;
  }) {
    this.connection = params.connection;
    this.device = params.device;
    this.onCloseCallback = params.onClose;
    this.onErrorCallback = params.onError;
    this.onSomeDeviceDisconnectBinded = this.onSomeDeviceDisconnect.bind(this);

    this.listening = false;
    this.pool = [];
    this.startListening();
  }

  public destroy() {
    this.stopListening();
    this.connection.close();
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
    this.connection.addListener('error', this.onError.bind(this));

    usb.on('detach', this.onSomeDeviceDisconnectBinded);
  }

  /**
   * Stop listening to all the events
   */
  private stopListening() {
    this.connection.removeListener('data', this.onData.bind(this));
    this.connection.removeListener('close', this.onClose.bind(this));
    this.connection.removeListener('error', this.onError.bind(this));
    this.connection.removeAllListeners();

    usb.removeListener('detach', this.onSomeDeviceDisconnectBinded);
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

  private onError(error: Error) {
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  private async onSomeDeviceDisconnect() {
    const connectedDevices = await getAvailableDevices();

    const isDeviceConnected = connectedDevices.some(
      d =>
        d.path === this.device.path &&
        d.serial === this.device.serial &&
        d.productId === this.device.productId &&
        d.type === this.device.type &&
        d.deviceState === this.device.deviceState &&
        d.vendorId === this.device.vendorId,
    );

    if (!isDeviceConnected) {
      this.onClose();
      this.destroy();
    }
  }
}
