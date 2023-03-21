import { AuthDeviceStatus } from '../../proto/generated/types';

export type AuthDeviceEventHandler = (event: AuthDeviceStatus) => void;
