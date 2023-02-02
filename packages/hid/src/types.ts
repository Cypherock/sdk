import { DeviceState } from '@cypherock/sdk-interfaces';
import SerialPort from 'serialport';

export interface IConnectionInfo {
  path: string;
  deviceState: DeviceState;
}
