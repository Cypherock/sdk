import { DeviceState } from '@cypherock/sdk-interfaces';
import SerialPort from 'serialport';

export interface IConnectionInfo {
  port: SerialPort.PortInfo;
  deviceState: DeviceState;
  hardwareVersion: string;
  inBootloader: boolean;
  serial: string | undefined;
}
