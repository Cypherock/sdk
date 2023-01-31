import SerialPort from 'serialport';
import { DeviceError, DeviceErrorType } from '@cypherock/sdk-interfaces';

import { IConnectionInfo } from './types';

const supportedVersionsToDeviceState: Record<string, string> = {
  // Bootloader
  '01': '00',
  // Intiial
  '02': '01',
  // Main
  '03': '02'
};

export const getAvailableConnectionInfo = async (): Promise<
  IConnectionInfo | undefined
> => {
  const list = await SerialPort.list();

  let port: SerialPort.PortInfo = { path: '' };
  let deviceState = '';
  let hardwareVersion = '00';
  let exists = false;

  // eslint-disable-next-line no-restricted-syntax
  for (const portParam of list) {
    const { vendorId, productId } = portParam;

    if (
      vendorId &&
      productId &&
      ['0483', '1209', '3503'].includes(String(vendorId))
    ) {
      const internalHardwareVersion = productId.slice(0, 2);
      const internalDeviceState = productId.slice(2, 4);

      // Check the PID is valid or not, only valid PID will be connected
      switch (String(vendorId)) {
        case '0483':
          if (
            internalHardwareVersion === '02' &&
            ['00', '01', '02'].includes(internalDeviceState)
          ) {
            port = portParam;
            hardwareVersion = internalHardwareVersion;
            deviceState = internalDeviceState;
            exists = true;
          }
          break;
        case '3503':
          if (
            internalHardwareVersion === '01' &&
            Object.keys(supportedVersionsToDeviceState).includes(
              internalDeviceState
            )
          ) {
            port = portParam;
            hardwareVersion = internalHardwareVersion;
            deviceState = supportedVersionsToDeviceState[internalDeviceState];
            exists = true;
          }
          break;
        default:
        // Do nothing
      }
    }

    if (exists) break;
  }

  if (port && port.path) {
    const { serialNumber: deviceSerialNumber } = port;

    return {
      port,
      serial: deviceSerialNumber,
      hardwareVersion,
      inBootloader: deviceState === '00',
      // 00: Bootloader, 01: Initial app, 02: Main app
      deviceState
    };
  }

  return undefined;
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
    throw new DeviceError(DeviceErrorType.NOT_CONNECTED);
  }

  return connectionInfo;
};
