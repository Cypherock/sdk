import DeviceConnection from '@cypherock/sdk-hw-hid';
import { ManagerApp } from '@cypherock/sdk-app-manager';

const run = async () => {
  const connection = await DeviceConnection.create();

  const managerApp = await ManagerApp.create(connection);

  const deviceInfo = await managerApp.getDeviceInfo();

  await managerApp.authDevice();

  await managerApp.trainCard({ onWallets: async () => true });

  await managerApp.authCard();

  console.log(deviceInfo);
};

run();
