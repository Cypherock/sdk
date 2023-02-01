import DeviceConnection from '@cypherock/sdk-hw-serialport';
import SDK from '@cypherock/sdk-core';

const run = async () => {
  const connection = await DeviceConnection.create();

  const sdk = await SDK.create(connection);

  console.log({ supported: sdk.isSupported(), version: sdk.getVersion() });
};

run();
