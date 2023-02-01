import DeviceConnection from "@cypherock/sdk-hw-webusb";
import SDK from "@cypherock/sdk-core";

export default async function run() {
  const connection = await DeviceConnection.create();
  console.log(connection);

  // const sdk = await SDK.create(connection);

  await connection.send(Uint8Array.from([1, 2]));
  for (let i = 0; i < 100; i += 1) {
    console.log(await connection.receive());
  }
  // console.log({ supported: sdk.isSupported(), version: sdk.getVersion() });
}
