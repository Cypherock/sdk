import DeviceConnection from "@cypherock/sdk-hw-webusb";
import SDK from "@cypherock/sdk-core";

export default async function run() {
  const connection = await DeviceConnection.create();

  const sdk = await SDK.create(connection);

  console.log({ supported: sdk.isSupported(), version: sdk.getVersion() });
}
