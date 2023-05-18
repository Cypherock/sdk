import HID from 'node-hid';
import {
  DeviceState,
  IDevice,
  ConnectionTypeMap,
} from '@cypherock/sdk-interfaces';

export const formatDeviceInfo = (device: HID.Device): IDevice | undefined => {
  const { vendorId, productId, serialNumber } = device;

  if (
    device.path &&
    vendorId === 0x3503 &&
    productId === 0x0103 &&
    serialNumber
  ) {
    return {
      path: device.path,
      deviceState: DeviceState.MAIN,
      vendorId,
      productId,
      serial: serialNumber,
      type: ConnectionTypeMap.HID,
    };
  }

  return undefined;
};

export const getAvailableDevices = async (): Promise<IDevice[]> => {
  const list = HID.devices();

  const deviceList: IDevice[] = [];

  for (const portParam of list) {
    const device = formatDeviceInfo(portParam);

    if (device) {
      deviceList.push(device);
    }
  }

  return deviceList;
};
