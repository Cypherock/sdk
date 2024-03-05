import * as HID from 'node-hid';
import * as uuid from 'uuid';
import { usb } from 'usb';
import { IDevice, PoolData } from '@cypherock/sdk-interfaces';
import { getAvailableDevices } from './connection';
import { logger } from '../logger';

// eslint-disable-next-line
export class DataListener {
  private readonly connection: HID.HIDAsync;

  private readonly device: IDevice;

  private listening: boolean;

  private readonly pool: PoolData[];

  private readonly onCloseCallback?: () => void;

  private readonly onErrorCallback?: (err: Error) => void;

  private readonly onSomeDeviceDisconnectBinded: (device: usb.Device) => void;

  private readTimeoutId: NodeJS.Timeout | undefined;

  private readPromise: Promise<void> | undefined;

  constructor(params: {
    connection: HID.HIDAsync;
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

    this.addAllListeners();
  }

  public async destroy() {
    if (this.readPromise) {
      await this.readPromise;
    }

    this.stopListening();
    this.removeAllListeners();

    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
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

  private clearReadInterval() {
    if (this.readTimeoutId) clearTimeout(this.readTimeoutId);
  }

  private setReadInterval() {
    this.readTimeoutId = setTimeout(this.onRead.bind(this), 0);
  }

  /**
   * Starts listening to all the events
   */
  public startListening() {
    this.listening = true;
    this.setReadInterval();
  }

  /**
   * Stop listening to all the events
   */
  public stopListening() {
    this.clearReadInterval();
    this.listening = false;
  }

  private addAllListeners() {
    this.connection.addListener('close', this.onClose.bind(this));
    this.connection.addListener('error', this.onError.bind(this));

    usb.on('detach', this.onSomeDeviceDisconnectBinded);
  }

  private removeAllListeners() {
    this.connection.removeListener('close', this.onClose.bind(this));
    this.connection.removeListener('error', this.onError.bind(this));
    this.connection.removeAllListeners();

    usb.removeListener('detach', this.onSomeDeviceDisconnectBinded);
  }

  private async onRead() {
    if (!this.listening) {
      this.clearReadInterval();
      return;
    }

    let resolvePromise: (() => void) | undefined;

    this.readPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    try {
      const data = await this.connection.read(20);
      this.onData(data as any);
    } catch (error) {
      logger.error('Error while reading data from device');
      logger.error(error);
    } finally {
      if (resolvePromise) resolvePromise();
      this.setReadInterval();
    }
  }

  private async onData(data: Buffer) {
    if (data && data.length > 0) {
      this.pool.push({ id: uuid.v4(), data: Uint8Array.from(data) });
    }
  }

  private async onClose() {
    this.stopListening();
    this.removeAllListeners();
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
      await this.destroy();
      this.onClose();
    }
  }
}
