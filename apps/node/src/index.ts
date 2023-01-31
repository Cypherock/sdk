import DeviceConnection from '@cypherock/sdk-hw-serialport';
// import SDK from '@cypherock/sdk-core';

const run = async () => {
  const connection = await DeviceConnection.create();
  console.log(connection);
};

run();
