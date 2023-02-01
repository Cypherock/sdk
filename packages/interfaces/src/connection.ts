export enum DeviceState {
  BOOTLOADER,
  INITIAL,
  MAIN
}


export interface PoolData {
  id: string;
  data: string;
}

export interface IDeviceConnection {
  isConnected(): boolean;
  beforeOperation(): Promise<void>;
  afterOperation(): Promise<void>;
  getSequenceNumber(): number;
  getNewSequenceNumber(): number;
  getDeviceState(): DeviceState;
  send(data: string): Promise<void>;
  receive(): Promise<string | undefined>;
  peek(): Promise<PoolData[]>;
  destroy(): Promise<void>;
}
