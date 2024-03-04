import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';

const supportedDevices: USBDeviceFilter[] = [
  { vendorId: 0x3503, productId: 259 },
];

const isUSBDeviceSupported = (device: USBDevice) => {
  const { vendorId, productId } = device;

  for (const supportedDevice of supportedDevices) {
    if (
      supportedDevice.vendorId === vendorId &&
      supportedDevice.productId === productId
    ) {
      return true;
    }
  }

  return false;
};

// eslint-disable-next-line
export const requestDevice = async () => {
  const connectionInfo = await navigator.usb.requestDevice({
    filters: supportedDevices,
  });

  if (!connectionInfo) {
    throw new DeviceConnectionError(DeviceConnectionErrorType.NOT_CONNECTED);
  }

  return connectionInfo;
};

export const getAvailableDevices = async () => {
  const allDevices = await navigator.usb.getDevices();

  return allDevices.filter(d => isUSBDeviceSupported(d));
};
