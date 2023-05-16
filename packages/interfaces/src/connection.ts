export const ConnectionTypeMap = {
  SERIAL_PORT: 'serial',
  HID: 'hid',
  WEBUSB: 'webusb',
};

export enum DeviceState {
  BOOTLOADER,
  INITIAL,
  MAIN,
}

export interface IDevice {
  path: string;
  deviceState: DeviceState;
  vendorId: number;
  productId: number;
  serial: string;
  type: string;
}

export interface PoolData {
  id: string;
  data: Uint8Array;
}

export interface IDeviceConnection {
  getConnectionType(): Promise<string>;
  isConnected(): Promise<boolean>;
  beforeOperation(): Promise<void>;
  afterOperation(): Promise<void>;
  getSequenceNumber(): Promise<number>;
  getNewSequenceNumber(): Promise<number>;
  getDeviceState(): Promise<DeviceState>;
  send(data: Uint8Array): Promise<void>;
  receive(): Promise<Uint8Array | undefined>;
  peek(): Promise<PoolData[]>;
  destroy(): Promise<void>;
}
