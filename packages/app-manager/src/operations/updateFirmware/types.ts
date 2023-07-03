import { IDevice, IDeviceConnection } from '@cypherock/sdk-interfaces';
import { IVersion, UpdateFirmwareStatus } from '../../proto/types';

export type GetDevices = () => Promise<IDevice[]>;

export type CreateDeviceConnection = (
  device: IDevice,
) => Promise<IDeviceConnection>;

export type UpdateFirmwareEventHandler = (event: UpdateFirmwareStatus) => void;

export interface IUpdateFirmwareParams {
  firmware?: Uint8Array;
  version?: IVersion;
  allowPrerelease?: boolean;
  createConnection: CreateDeviceConnection;
  getDevices: GetDevices;
  onProgress?: (progress: number) => void;
  onEvent?: UpdateFirmwareEventHandler;
}
