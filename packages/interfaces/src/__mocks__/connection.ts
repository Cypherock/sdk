import * as uuid from 'uuid';

import {
  ConnectionTypeMap,
  DeviceState,
  IDeviceConnection,
  PoolData,
} from '../connection';
import { DeviceConnectionError, DeviceConnectionErrorType } from '../errors';

export class MockDeviceConnection implements IDeviceConnection {
  private isConnectionOpen: boolean;

  private isDestroyed: boolean;

  private sequenceNumber: number;

  private deviceState: DeviceState;

  private connectionType: string;

  private onData?: (data: Uint8Array) => void;

  private readonly pool: PoolData[];

  private constructor() {
    this.isConnectionOpen = false;
    this.isDestroyed = false;
    this.sequenceNumber = 0;
    this.pool = [];
    this.deviceState = DeviceState.MAIN;
    this.connectionType = ConnectionTypeMap.SERIAL_PORT;
  }

  public configureDevice(deviceState: DeviceState, connectionType: string) {
    this.deviceState = deviceState;
    this.connectionType = connectionType;
  }

  public configureListeners(onData: (data: Uint8Array) => void) {
    this.onData = onData;
  }

  public removeListeners() {
    this.onData = undefined;
  }

  public static async create() {
    return new MockDeviceConnection();
  }

  public async getConnectionType() {
    return this.connectionType;
  }

  public async isConnected() {
    return !this.isDestroyed;
  }

  public async beforeOperation() {
    this.isConnectionOpen = true;
  }

  public async afterOperation() {
    this.isConnectionOpen = false;
  }

  public async getSequenceNumber() {
    return this.sequenceNumber;
  }

  public async getNewSequenceNumber() {
    this.sequenceNumber += 1;
    return this.sequenceNumber;
  }

  public async getDeviceState() {
    return this.deviceState;
  }

  public async destroy() {
    this.isDestroyed = true;
    this.isConnectionOpen = false;
  }

  public async send(data: Uint8Array) {
    if (!this.isConnectionOpen) {
      throw new DeviceConnectionError(
        DeviceConnectionErrorType.CONNECTION_CLOSED,
      );
    }

    if (this.onData) {
      this.onData(data);
    }
  }

  public async mockDeviceSend(data: Uint8Array) {
    this.pool.push({ id: uuid.v4(), data });
  }

  public async receive() {
    return this.pool.shift()?.data;
  }

  public async peek() {
    return [...this.pool];
  }
}
