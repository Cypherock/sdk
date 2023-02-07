import DeviceConnection from '@cypherock/sdk-hw-hid';
import SDK from '@cypherock/sdk-core';

const run = async () => {
  const connection = await DeviceConnection.create();

  const sdk = await SDK.create(connection);

  console.log({ supported: sdk.isSupported(), version: sdk.getVersion() });

  const status = await sdk.getStatus();

  console.log({status});

  const sequenceNumber = sdk.getNewSequenceNumber();
  await sdk.sendCommand({
    commandType: 87,
    data: '00',
    sequenceNumber
  });
  const data = await sdk.waitForCommandOutput({
    sequenceNumber,
    expectedCommandTypes: [87],
    onStatus: () => {}
  });

  const isAuthenticated = data.data.slice(0, 2);
  const serial = data.data.slice(2, 64 + 2);
  const firmwareVersion = data.data.slice(64 + 2, 64 + 2 + 8);

  console.log({ isAuthenticated, serial, firmwareVersion });
};

run();
