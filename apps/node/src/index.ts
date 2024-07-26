import DeviceConnection, {
  updateLogger as updateLoggerHid,
} from '@cypherock/sdk-hw-hid';
import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import { ManagerApp, updateLogger } from '@cypherock/sdk-app-manager';
import { updateLogger as updateLoggerCore } from '@cypherock/sdk-core';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as bitcoinJsLib from 'bitcoinjs-lib';
import * as nearApiJs from 'near-api-js';
import * as solanaWeb3 from '@solana/web3.js';
import { setBitcoinJSLib } from '@cypherock/sdk-app-btc';
import { setEthersLib } from '@cypherock/sdk-app-evm';
import { setNearApiJs } from '@cypherock/sdk-app-near';
import { setSolanaWeb3 } from '@cypherock/sdk-app-solana';
import { InheritanceApp } from '@cypherock/sdk-app-inheritance'
 import { IWalletSignParams } from '@cypherock/sdk-app-inheritance/src/operations'
import { ethers } from 'ethers';
import { createServiceLogger } from './logger';
// import { SDK } from '@cypherock/sdk-core';

const run = async () => {
  updateLogger(createServiceLogger);
  updateLoggerCore(createServiceLogger);
  updateLoggerHid(createServiceLogger);

  setBitcoinJSLib(bitcoinJsLib);
  setEthersLib(ethers);
  setNearApiJs(nearApiJs);
  setSolanaWeb3(solanaWeb3);

  let connection: IDeviceConnection;

  try {
    connection = await DeviceConnection.create();
  } catch (error) {
    connection = await DeviceConnectionSerialport.create();
  }

  const iApp = await InheritanceApp.create(connection);
  const mApp = await ManagerApp.create(connection);

  const wallets = await mApp.getWallets();
  const  params : IWalletSignParams = {
    challenge: wallets.walletList[0].id,
    walletId: wallets.walletList[0].id,
    // new Uint8Array([
    //        154, 108, 179,  79, 204, 240, 165, 236,
    //        246, 144,  78, 203, 251,  52,  85, 159,
    //        156,  50,  40,  48,  60, 252, 219, 179,
    //         32, 238,   7, 150,   0, 119,   7, 206
    //      ]),
    isPublickey: true
  }

  const challengeresponse = await iApp.getWalletAuth(params);

  console.log(challengeresponse);

  // await managerApp.authDevice();

  // await managerApp.trainCard({ onWallets: async () => true });

  // await managerApp.authCard();

  // await managerApp.updateFirmware({
  //   getDevices: async () => [
  //     ...(await DeviceConnection.list()),
  //     ...(await DeviceConnectionSerialport.list()),
  //   ],
  //   createConnection: async d =>
  //     d.type === 'hid'
  //       ? DeviceConnection.connect(d)
  //       : DeviceConnectionSerialport.connect(d),
  //   allowPrerelease: true,
  // });
};

run();
