import { EventEmitter } from 'events';

import { LegacyDecodedPacketData } from './xmodem/legacy';

export interface PacketData extends LegacyDecodedPacketData {
  id: string;
}

export interface DeviceConnectionInterface {
  getPacketsFromPool(_commandTypes: number[]): PacketData[];
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
