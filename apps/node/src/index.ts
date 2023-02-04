// import DeviceConnection from '@cypherock/sdk-hw-hid';
import SDK from '@cypherock/sdk-core-rust';

const run = async () => {
  // const connection = await DeviceConnection.create();

  const sdk = await SDK.create();
  console.log(sdk);
  sdk.run();

  // console.log({ supported: sdk.isSupported(), version: sdk.getVersion() });
};

run();
