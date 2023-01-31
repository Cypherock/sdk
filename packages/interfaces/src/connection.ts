export interface IDeviceConnection {
  isConnected(): boolean;
  beforeOperation(): void;
  afterOperation(): void;
  getSequenceNumber(): number;
  getNewSequenceNumber(): number;
  send(data: string): Promise<void>;
  receive(timeout?: number): Promise<string>;
  destroy(): Promise<void>;
}
