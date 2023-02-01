import { DeviceError, DeviceErrorType } from '@cypherock/sdk-interfaces';

const supportedDevices: USBDeviceFilter[] = [
  { vendorId: 0x3503, productId: 259 }
];

// eslint-disable-next-line
export const createPort = async () => {
  const connectionInfo = await navigator.usb.requestDevice({
    filters: supportedDevices
  });

  if (!connectionInfo) {
    throw new DeviceError(DeviceErrorType.NOT_CONNECTED);
  }

  return connectionInfo;
};
