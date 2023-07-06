import { AuthDeviceStatus } from '../../proto/generated/types';

export type AuthDeviceEventHandler = (event: AuthDeviceStatus) => void;

export interface IAuthDeviceParams {
  onEvent?: AuthDeviceEventHandler;
  email?: string;
  cysyncVersion?: string;
}
