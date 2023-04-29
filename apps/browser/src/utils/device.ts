import DeviceConnection from '@cypherock/sdk-hw-webusb';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import {SDK} from '@cypherock/sdk-core'

export default async function run() {
  const connection = await DeviceConnection.create();

  // const managerApp = await ManagerApp.create(connection);

  const sdk = await SDK.create(connection, 1);

  await sdk.runOperation(async () => {
      await sdk.deprecated.sendCommand({commandType:87, data:'00', sequenceNumber:1});
      console.log("Sent");
      const status = await sdk.deprecated.getCommandStatus();
      console.log("Got Status", {status});
      const recvData = await sdk.deprecated.waitForCommandOutput({sequenceNumber:1, expectedCommandTypes: [87], onStatus: console.log});
      console.log("Received: ", recvData);
    }
  )
}
