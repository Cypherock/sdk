import DeviceConnection from '@cypherock/sdk-hw-hid';
// import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import { ManagerApp } from '@cypherock/sdk-app-manager';

const run = async () => {
  const connection = await DeviceConnection.create();

  const managerApp = await ManagerApp.create(connection);

  const deviceInfo = await managerApp.getDeviceInfo();

  console.log(deviceInfo);

  await managerApp.authDevice();

  await managerApp.trainCard({ onWallets: async () => true });

  await managerApp.authCard();

  // await managerApp.updateFirmware({
  //   createConnection: async () => DeviceConnection.create(),
  //   createSerialportConnection: async () => DeviceConnectionSerialport.create(),
  // });
};

run();
