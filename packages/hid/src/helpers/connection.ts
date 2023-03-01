import HID from 'node-hid';
import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  DeviceState
} from '@cypherock/sdk-interfaces';

import { IConnectionInfo } from '../types';

const supportedVersionsToDeviceState: Record<string, DeviceState> = {
  // Bootloader
  '01': DeviceState.BOOTLOADER,
  // Intiial
  '02': DeviceState.INITIAL,
  // Main
  '03': DeviceState.MAIN
};

export const formatDeviceInfo = (
  device: HID.Device
): IConnectionInfo | undefined => {
  const { vendorId, productId } = device;

  if (vendorId && productId && vendorId === 0x3503) {
    const internalHardwareVersion = productId
      .toString(16)
      .padStart(4, '0')
      .slice(0, 2);
    const internalDeviceState = productId
      .toString(16)
      .padStart(4, '0')
      .slice(2, 4);

    if (
      device.path &&
      internalHardwareVersion === '01' &&
      Object.keys(supportedVersionsToDeviceState).includes(internalDeviceState)
    ) {
      return {
        path: device.path,
        deviceState: supportedVersionsToDeviceState[internalDeviceState]
      };
    }
  }

  return undefined;
};

export const getAvailableConnectionInfo = async (): Promise<
  IConnectionInfo | undefined
> => {
  const list = HID.devices();

  let connectionInfo: IConnectionInfo | undefined;

  // eslint-disable-next-line no-restricted-syntax
  for (const portParam of list) {
    connectionInfo = formatDeviceInfo(portParam);

    if (connectionInfo) break;
  }

  return connectionInfo;
};

/**
 * This method finds the port on which the hardware wallet is connected
 * and returns a SerialPort connection instance with the hardware wallet
 * or throws an error 'Device not connected'.
 *
 * @example
 * ```typescript
 * import {createPort} from '@cypherock/communication'
 *
 * const connection = await createPort();
 *
 * ```
 */
export const createPort = async () => {
  const connectionInfo = await getAvailableConnectionInfo();

  if (!connectionInfo) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  return connectionInfo;
};
