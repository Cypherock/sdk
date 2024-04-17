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
import { SolanaApp, setSolanaWeb3 } from '@cypherock/sdk-app-solana';
import { ethers } from 'ethers';
import { BittensorApp } from '@cypherock/sdk-app-bittensor';

import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
	construct,
	decode,
	deriveAddress,
	getRegistry,
	methods,
	PolkadotSS58Format,
 createMetadata, OptionsWithMeta } from '@substrate/txwrapper-polkadot';

import { KeyringPair } from '@polkadot/keyring/types';
import { 
  EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import fetch from 'node-fetch';
import { createServiceLogger } from './logger';
// const fetch = require('node-fetch');

 // Define a custom type for your API response
 interface ApiResponse {
     error: any;
     result: any;
 }
 
 /**
  * Send a JSONRPC request to the node at http://0.0.0.0:9933.
  *
  * @param method - The JSONRPC request method.
  * @param params - The JSONRPC request params.
  */
 function rpcToLocalNode(
   method: string,
   params: any[] = [],
 ): Promise<any> {
  console.log(JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method,
    params,
  }));
   return fetch('http://127.0.0.1:9933', {
     body: JSON.stringify({
       id: 1,
       jsonrpc: '2.0',
       method,
       params,
     }),
     headers: {
       'Content-Type': 'application/json',
       connection: 'keep-alive',
     },
     method: 'POST',
   })
   .then((response: any) => response.json())
     .then((data: ApiResponse) => {
         const { error, result } = data;
         if (error) {
             throw new Error(
                 `${error.code} ${error.message}: ${JSON.stringify(error.data)}`
             );
         }
         return result;
     })
 }
 
 
 /**
  * Signing function. Implement this on the OFFLINE signing device.
  *
  * @param pair - The signing pair.
  * @param signingPayload - Payload to sign.
  * @returns A signed ExtrinsicPayload returns a signature with the type `0x${string}` via polkadot-js.
  */
 function signWith(
   pair: KeyringPair,
   signingPayload: string,
   options: OptionsWithMeta,
 ): `0x${string}` {
   const { registry, metadataRpc } = options;
   // Important! The registry needs to be updated with latest metadata, so make
   // sure to run `registry.setMetadata(metadata)` before signing.
   registry.setMetadata(createMetadata(registry, metadataRpc));
 
   const { signature } = registry
     .createType('ExtrinsicPayload', signingPayload, {
       version: EXTRINSIC_VERSION,
     })
     .sign(pair);
 
   return signature as unknown as `0x${string}`;
 } 

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

  const managerApp = await ManagerApp.create(connection);

  const deviceInfo = await managerApp.getDeviceInfo();

  const wallet = (await managerApp.getWallets()).walletList[0];
  
  // const bittensorApp = await BittensorApp.create(connection);
  const solanaApp = await SolanaApp.create(connection);

  await cryptoWaitReady();

  const { block } = await rpcToLocalNode('chain_getBlock');
  const blockHash = await rpcToLocalNode('chain_getBlockHash');
  const genesisHash = await rpcToLocalNode('chain_getBlockHash', [0]);
  const metadataRpc = await rpcToLocalNode('state_getMetadata');
  const { specVersion, transactionVersion, specName } = await rpcToLocalNode(
    'state_getRuntimeVersion',
  );

  const registry = getRegistry({
    chainName: 'Bittensor',
    specName,
    specVersion,
    metadataRpc,
  });

  // Device
  // const bittensorPubKey = (await bittensorApp.getPublicKeys({
  //   walletId: wallet.id,
  //   derivationPaths: [{ path: [0, 0, 0, 0, 0] }]
  // })).publicKeys[0];

  // console.log(`\nPublic Key device: ${bittensorPubKey}`);
  // const addressBit = deriveAddress(bittensorPubKey, PolkadotSS58Format.substrate);

  const keyring = new Keyring();
	const pair = keyring.addFromUri('sample split bamboo west visual approve brain fox arch impact relief smile', { name: 'mnemonic' }, 'ed25519');
  const publicKey = Buffer.from(pair.publicKey).toString('hex');
	console.log(`\nPublic Key cal: ${publicKey}`);
  const addressBit = deriveAddress(pair.publicKey, PolkadotSS58Format.substrate);

  const unsigned = methods.balances.transferKeepAlive(
    {
      value: '10000000000',
      dest: { id: '5CkbuLTrGiAiPubc8qK5dC5WbG1hDGXRSt1arFE5Zimu71R1' }, // Bob
    },
    {
      address: addressBit,
      blockHash,
      blockNumber: (registry
        .createType('BlockNumber', block.header.number) as any)
        .toNumber(),
      eraPeriod: 64,
      genesisHash,
      metadataRpc,
      nonce: 0, // Assuming this is Alice's first tx on the chain
      specVersion,
      tip: 0,
      transactionVersion,
    },
    {
      metadataRpc,
      registry,
    },
  );

  console.log({unsigned});

  // Decode an unsigned transaction.
  const decodedUnsigned = decode(unsigned, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  To: ${
      (decodedUnsigned.address)
    }\n  Amount: ${decodedUnsigned.method.args.value}`,
  );

  // Construct the signing payload from an unsigned transaction.
  const signingPayload = construct.signingPayload(unsigned, { registry });
  console.log(`\nPayload to Sign: ${signingPayload}`);

  // Decode the information from a signing payload.
  const payloadInfo = decode(signingPayload, {
    metadataRpc,
    registry,
  });
  console.log(
    `\nDecoded Transaction\n  To: ${
      (payloadInfo.method.args.dest as { id: string }).id
    }\n  Amount: ${payloadInfo.method.args.value}`,
  );

  // const resultSig = await bittensorApp.signTxn({
  //   derivationPath: [0x80000000 + 44, 0x80000000, 0x80000000, 1, 0],
  //   txn: signingPayload,
  //   walletId: wallet.id,
  // });

  const resultSig = await solanaApp.signTxn({
    derivationPath: [0x80000000 + 44, 0x80000000 + 501, 0x80000000],
    txn: '010001031be0085a98d799ea6facc190a95b5be7a7f2d95cff4826969b477f4dca875c08ae0bd6e8b5b56d580baefb64f6f52260ee8f9983b7f8fd61f526a30d6f5ff52900000000000000000000000000000000000000000000000000000000000000006540dea139d4c66db55b927a9e2c5f584f23bb35048e937fddae551af08fbc9c01020200010c0200000080841e0000000000',
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
  });

  // Serialize a signed transaction.
	const tx = construct.signedTx(unsigned, `0x${resultSig.signature}`, {
		metadataRpc,
		registry,
	});
	console.log(`\nTransaction to Submit: ${tx}`);

	// // Derive the tx hash of a signed transaction offline and through rpc
	// const expectedTxHash = construct.txHash(tx);
	// console.log(`\nExpected Tx Hash: ${expectedTxHash}`);
	// const actualTxHash = await rpcToLocalNode('author_submitExtrinsic', [tx]);
	// console.log(`Actual Tx Hash: ${actualTxHash}`);

	// // Decode a signed payload.
	// const txInfo = decode(tx, {
	// 	metadataRpc,
	// 	registry,
	// });
	// console.log(
	// 	`\nDecoded Transaction\n  To: ${
	// 		(txInfo.method.args.dest as { id: string }).id
	// 	}\n  Amount: ${txInfo.method.args.value}\n`,
	// );

  
  console.log(deviceInfo);

  await managerApp.authDevice();

  await managerApp.trainCard({ onWallets: async () => true });

  await managerApp.authCard();

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

}

run();
