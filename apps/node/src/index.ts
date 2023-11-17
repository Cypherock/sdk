import DeviceConnection from '@cypherock/sdk-hw-hid';
import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as bitcoinJsLib from 'bitcoinjs-lib';
import * as nearApiJs from 'near-api-js';
import { setBitcoinJSLib, BtcApp } from '@cypherock/sdk-app-btc';
import { MPCApp, IEntityInfo } from '@cypherock/sdk-app-mpc';
import { setEthersLib } from '@cypherock/sdk-app-evm';
import { setNearApiJs } from '@cypherock/sdk-app-near';
import { ethers } from 'ethers';

import { webcrypto } from 'crypto';
const { subtle } = webcrypto;

async function computeSHA256(arrayBuffer: Uint8Array): Promise<Uint8Array> {
    const hashBuffer = await subtle.digest("SHA-256", arrayBuffer);
    return new Uint8Array(hashBuffer);
}

function hexToUInt8Array(hexString: string): Uint8Array {
    const byteArray = new Uint8Array(hexString.length / 2);

    for (let i = 0, j = 0; i < hexString.length; i += 2, j++) {
        byteArray[j] = parseInt(hexString.substr(i, 2), 16);
    }

    return byteArray;
}

const run = async () => {
  setBitcoinJSLib(bitcoinJsLib);
  setEthersLib(ethers);
  setNearApiJs(nearApiJs);

  let connection: IDeviceConnection;

  try {
    connection = await DeviceConnection.create();
  } catch (error) {
    connection = await DeviceConnectionSerialport.create();
  }

  const mpcApp = await MPCApp.create(connection);
  const managerApp = await ManagerApp.create(connection);

  let random_nonce = await mpcApp.getRandomNonce();
  console.log(random_nonce);

  const deviceInfo = await managerApp.getDeviceInfo();
  console.log(deviceInfo);
  let device_id = deviceInfo.deviceSerial;

  const wallets = await managerApp.getWallets();
  console.log(wallets.walletList[0].id);
  const cytest_wallet_id: Uint8Array = wallets.walletList[0].id;

  let pubKey = hexToUInt8Array("03dd7d01b5ea99dd176ccaa5a393c39a3bea87e46531780a1134b476d1b381fa2e");
  let privKey = hexToUInt8Array("e87a716d34a5ff375e6ea01b2bd904e545437f9213bacfa5b4599b1ece4cef42");

  const timestamp = 123;

  let entity_info: IEntityInfo = MPCApp.createEntityInfo(timestamp, device_id, 1, 2, device_id, pubKey, cytest_wallet_id);

  console.log("Printing entity info...");
  console.log(entity_info);

  let entity_info_raw = MPCApp.encodeEntityInfo(entity_info);

  console.log("Printing raw entity info...");
  console.log(entity_info_raw);

  let hashedArray = await computeSHA256(entity_info_raw);

  console.log("Printing hashed entity info...");
  console.log(hashedArray);

  console.log("Printing base64 fingerprint...");
  console.log(Buffer.from(hashedArray).toString('base64'));
  
  // signing entity info
  let signature = await mpcApp.signEntityInfo({fingerprint: hashedArray, entityInfo: entity_info, devPrivKey: privKey});
  console.log("Printing signature ...");
  console.log(signature.signature);

  // verify signature
  let result = await mpcApp.verifyEntityInfo({fingerprint: hashedArray, entityInfo: entity_info, signature: signature.signature});
  console.log(result.verified);
};

run();
