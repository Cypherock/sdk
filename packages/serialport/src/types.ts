import { EventEmitter } from 'events';
import SerialPort from 'serialport';

export interface IConnectionInfo {
  port: SerialPort.PortInfo;
  deviceState: string;
  hardwareVersion: string;
  inBootloader: boolean;
  serial: string | undefined;
}

export interface DeviceConnectionInterface {
  onPacketUse(packetId: string): void;
  isOpen(): boolean;
  isConnected(): boolean;
  write(data: string): Promise<void>;
  sendData(command: number, data: string, maxTries?: number): void;
  receiveData(
    commands: number[],
    timeout?: number
  ): Promise<{ commandType: number; data: string }>;
  addListener: EventEmitter['addListener'];
  removeListener: EventEmitter['removeListener'];
  removeAllListeners: EventEmitter['removeAllListeners'];
  getSequenceNumber(): number;
}
