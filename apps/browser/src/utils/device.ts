import DeviceConnection from "@cypherock/sdk-hw-webusb";
import SDK from "@cypherock/sdk-core-rust";

export default async function run() {
  const connection = await DeviceConnection.create();

  const sdk = await SDK.create(connection, {
    url: "http://127.0.0.1:8080/packages/core-rust/wasm",
  });
  console.log(sdk);
  // sdk.run();

  // console.log({ supported: sdk.isSupported(), version: sdk.getVersion() });
}
