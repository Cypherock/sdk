import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { IVersion } from '../../proto/generated/types';

export type CreateDeviceConnection = () => Promise<IDeviceConnection>;

export interface IUpdateFirmwareParams {
  firmware?: Uint8Array;
  version?: IVersion;
  allowPrerelease?: boolean;
  createSerialportConnection: CreateDeviceConnection;
  createConnection: CreateDeviceConnection;
  onProgress?: (progress: number) => void;
}
