import { DeviceState, IDeviceConnection } from '@cypherock/sdk-interfaces';
import { PacketVersion } from './utils';

export interface ISDK {
  getConnection(): IDeviceConnection;
  getVersion(): string;
  getPacketVersion(): PacketVersion | undefined;
  getSequenceNumber(): number;
  getNewSequenceNumber(): number;
  beforeOperation(): Promise<void>;
  afterOperation(): Promise<void>;
  isInBootloader(): boolean;
  getDeviceState(): DeviceState;
  validateNotInBootloaderMode(): void;
}
