import DeviceConnection from '@cypherock/sdk-hw-hid';
import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as bitcoinJsLib from 'bitcoinjs-lib';
import * as nearApiJs from 'near-api-js';
import * as solanaWeb3 from '@solana/web3.js';
import { setBitcoinJSLib } from '@cypherock/sdk-app-btc';
import { setEthersLib } from '@cypherock/sdk-app-evm';
import { setNearApiJs } from '@cypherock/sdk-app-near';
import {
  SolanaApp,
  setSolanaWeb3,
  base58Decode,
  getLatestBlockHash,
} from '@cypherock/sdk-app-solana';
import { ethers } from 'ethers';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

const run = async () => {
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

  const managerApp = await ManagerApp.create(connection);

  const wallets = await managerApp.getWallets();

  const solanaApp = await SolanaApp.create(connection);

  const publicKeys = await solanaApp.getPublicKeys({
    walletId:
      wallets.walletList.find(w => w.name === 'CYTEST')?.id ??
      new Uint8Array(0),
    derivationPaths: [
      { path: [0x80000000 + 44, 0x80000000 + 501] },
      { path: [0x80000000 + 44, 0x80000000 + 501, 0x80000000] },
      { path: [0x80000000 + 44, 0x80000000 + 501, 0x80000000, 0x80000000] },
    ],
  });

  console.log(publicKeys.publicKeys);
  const senderAddress = publicKeys.publicKeys[1];
  const receiverAddress = publicKeys.publicKeys[0];

  const feePayer = solanaWeb3.PublicKey.decode(
    Buffer.from(uint8ArrayToHex(base58Decode(senderAddress)), 'hex').reverse(),
  );
  const receiverPublicKey = solanaWeb3.PublicKey.decode(
    Buffer.from(
      uint8ArrayToHex(base58Decode(receiverAddress)),
      'hex',
    ).reverse(),
  );
  const recentBlockhash = await getLatestBlockHash();
  const transaction = new solanaWeb3.Transaction({
    recentBlockhash,
    feePayer,
  });
  transaction.add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: feePayer,
      toPubkey: receiverPublicKey,
      lamports: parseInt('1', 10),
    }),
  );
  const unsignedTransactionHex = transaction.serializeMessage().toString('hex');

  console.log({ unsignedTransactionHex });
  const { serializedTxn, signature } = await solanaApp.signTxn({
    walletId:
      wallets.walletList.find(w => w.name === 'CYTEST')?.id ??
      new Uint8Array(0),
    derivationPath: [0x80000000 + 44, 0x80000000 + 501, 0x80000000],
    txn: unsignedTransactionHex,
    serializeTxn: true,
  });

  console.log({ serializedTxn, signature });
  await solanaApp.destroy();

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
