import DeviceConnection from '@cypherock/sdk-hw-webusb';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { BtcApp } from '@cypherock/sdk-app-btc';
import * as btcjsLib from '../generated/bitcoinjs-lib';
import { setBitcoinJSLib } from '@cypherock/sdk-app-btc';

export default async function run() {
  const connection = await DeviceConnection.create();

  const managerApp = await ManagerApp.create(connection);

  console.log(await managerApp.getDeviceInfo());

  const btcApp = await BtcApp.create(connection);
  setBitcoinJSLib(btcjsLib as any);

  const result = await btcApp.getPublicKey({
    walletId: new Uint8Array(
      Buffer.from(
        '0ebe8d7ae18567f34e6898a7cffb3e6b1b1a3817744e6520452d2073258c328d',
        'hex',
      ),
    ),
    derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 1, 0],
  });
  console.log({ result });
}
