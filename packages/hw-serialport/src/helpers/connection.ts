import SerialPort from 'serialport';
import { DeviceState, IDevice } from '@cypherock/sdk-interfaces';

const legacySupportedVersionsToDeviceState: Record<string, DeviceState> = {
  // Bootloader
  '00': DeviceState.BOOTLOADER,
  // Intiial
  '01': DeviceState.INITIAL,
  // Main
  '02': DeviceState.MAIN,
};

const supportedVersionsToDeviceState: Record<string, DeviceState> = {
  // Bootloader
  '01': DeviceState.BOOTLOADER,
  // Intiial
  '02': DeviceState.INITIAL,
  // Main
  '03': DeviceState.MAIN,
};

export const getAvailableDevices = async (): Promise<IDevice[]> => {
  const list = await SerialPort.list();

  const devices: IDevice[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const portParam of list) {
    const { vendorId, productId, serialNumber, path } = portParam;

    if (
      vendorId &&
      productId &&
      serialNumber &&
      ['0483', '3503'].includes(String(vendorId))
    ) {
      const internalHardwareVersion = productId.slice(0, 2);
      const internalDeviceState = productId.slice(2, 4);

      // Check the PID is valid or not, only valid PID will be connected
      switch (String(vendorId)) {
        case '0483':
          if (
            internalHardwareVersion === '02' &&
            Object.keys(legacySupportedVersionsToDeviceState).includes(
              internalDeviceState,
            )
          ) {
            devices.push({
              path,
              deviceState:
                legacySupportedVersionsToDeviceState[internalDeviceState],
              serial: serialNumber,
              vendorId: parseInt(vendorId, 10),
              productId: parseInt(productId, 10),
            });
          }
          break;
        case '3503':
          if (
            internalHardwareVersion === '01' &&
            Object.keys(supportedVersionsToDeviceState).includes(
              internalDeviceState,
            )
          ) {
            devices.push({
              path,
              deviceState: supportedVersionsToDeviceState[internalDeviceState],
              serial: serialNumber,
              vendorId: parseInt(vendorId, 10),
              productId: parseInt(productId, 10),
            });
          }
          break;
        default:
        // Do nothing
      }
    }
  }

  return devices;
};
