import DeviceConnection from '@cypherock/sdk-hw-serialport';
import SDK from '@cypherock/sdk-core';

// function delay(ms: number) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);
//   });
// }

const run = async () => {
  const connection = await DeviceConnection.create();
  const sdk = await SDK.create(connection);
  console.log({ supported: sdk.isSupported(), version: sdk.getVersion() });
};

run();
