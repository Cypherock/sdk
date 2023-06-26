import DeviceConnection from '@cypherock/sdk-hw-webusb';
import { ManagerApp } from '@cypherock/sdk-app-manager';

export default async function run() {
  const connection = await DeviceConnection.create();

  const managerApp = await ManagerApp.create(connection);

  console.log(await managerApp.getDeviceInfo());
}
