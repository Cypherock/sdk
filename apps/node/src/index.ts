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
  console.log(deviceInfo);

  const wallet = (await managerApp.getWallets()).walletList[0];
  console.log("wallet ID: ", wallet.id);

  
  const bittensorApp = await BittensorApp.create(connection);

  // TXN INFO (in ed25519 scheme)
  // --- Source --------
  // seed phrase: spread sword village control response joke phrase share merit miss door canoe setup surge remind tiger increase sphere busy hand scrap diesel hair bomb
  // secret key: 0xf2e4cada34659c4f10221565421ecc5cc565e98b0cc1e57849cf5c30547f67bb
  // public key: 0x15771a0a9a77d1a4523190c911d3e1f75dfb6aee172baf3bbe576561897e5216
  // Addr (42) : 5CYrF4rWMEfb2PWZKLxXxiH4aB8vLPwsigUahG6AszvgbBbj                  <substrate/westend/bittensor>
  // --- Destination ---
  // seed phrase: sample split bamboo west visual approve brain fox arch impact relief smile
  // secret key: 0x9fa1ab1d37025d8c3cd596ecbf50435572eeaeb1785a0c9ed2b22afa4c378d6a
  // public key: 0x10b22ebe89b321370bee8d39d5c5d411daf1e8fc91c9d1534044590f1f966ebc
  // Addr (42) : 5CSbZ7wG456oty4WoiX6a1J88VUbrCXLhrKVJ9q95BsYH4TZ
  // Addr (0)  : 1NthTCKurNHLW52mMa6iA8Gz7UFYW5UnM3yTSpVdGu4Th7h

  const dest = '5CSbZ7wG456oty4WoiX6a1J88VUbrCXLhrKVJ9q95BsYH4TZ';
  const amount = 100; // WND

  await cryptoWaitReady();

  const { block } = await rpcToLocalNode('chain_getBlock');
  const blockHash = await rpcToLocalNode('chain_getBlockHash');
  const genesisHash = await rpcToLocalNode('chain_getBlockHash', [0]);
  const metadataRpc = await rpcToLocalNode('state_getMetadata');
  const { specVersion, transactionVersion, specName } = await rpcToLocalNode(
    'state_getRuntimeVersion',
  );

  const registry = getRegistry({
    chainName: 'Westend',
    specName,
    specVersion,
    metadataRpc,
  });

  // Public key from device
  const bittensorPubKey = (await bittensorApp.getPublicKeys({
    walletId: wallet.id,
    derivationPaths: [{path: [0x80000000 + 44, 0x80000000 + 354, 0x80000000, 0x80000000]}],
  })).publicKeys[0];
  console.log(`\nPublic Key expected: ${bittensorPubKey}`);
  
  const bittensorAddressBit = deriveAddress(`0x${bittensorPubKey}`, PolkadotSS58Format.westend);
  console.log(`\nAddress device: ${bittensorAddressBit}`);

  // Pubkey Verify - done on device
  const keyring = new Keyring();
  // // const pair = keyring.addFromUri('sample split bamboo west visual approve brain fox arch impact relief smile', { name: 'mnemonic' }, 'ed25519');
  const pair = keyring.addFromUri('spread sword village control response joke phrase share merit miss door canoe setup surge remind tiger increase sphere busy hand scrap diesel hair bomb', { name: 'mnemonic' }, 'ed25519');
  const publicKey = Buffer.from(pair.publicKey).toString('hex');
  console.log(`\nPublic Key expected: ${publicKey}`);
  const addressBit = deriveAddress(pair.publicKey, PolkadotSS58Format.substrate);
  console.log(`\nAddress expected: ${addressBit}`);


  // Construct unsigned payload
  const unsigned = methods.balances.transferKeepAlive(
    {
      value: amount,
      dest: { id: dest },
    },
    {
      address: bittensorAddressBit,
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
      (decodedUnsigned.method.args.dest)
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


  // Signature from device
  const resultSig = await bittensorApp.signTxn({
    derivationPath: [0x80000000 + 44, 0x80000000 + 354, 0x80000000, 0x80000000],
    txn: signingPayload,
    walletId: wallet.id,
  });
  console.log(`\nSignature actual: 0x00${resultSig.signature}`);

  // Signature verify
	const signature = signWith(pair, signingPayload, {
		metadataRpc,
		registry,
	});
	console.log(`\nSignature expected: ${signature}`);

  console.log(`\nDestination address: ${dest}`);
  console.log(`\nAmount: ${amount}`);

  
  // Serialize a signed transaction.
	const tx = construct.signedTx(unsigned, `0x00${resultSig.signature}`, {
		metadataRpc,
		registry,
	});
	console.log(`\nTransaction to Submit: ${tx}`);

  // Expected Serialize a signed transaction.
	const tx1 = construct.signedTx(unsigned, signature, {
		metadataRpc,
		registry,
	});
	console.log(`\nTransaction to Expected Submit: ${tx1}`);

	// Derive the tx hash of a signed transaction offline and through rpc
	const expectedTxHash = construct.txHash(tx);
	console.log(`\nTx Hash expected: ${expectedTxHash}`);
	const actualTxHash = await rpcToLocalNode('author_submitExtrinsic', [tx1]);
	console.log(`Tx Hash actual: ${actualTxHash}`);
  const actualTxHashdevice = await rpcToLocalNode('author_submitExtrinsic', [tx]);
	console.log(`Tx Hash actual device: ${actualTxHashdevice}`);

	// Decode a signed payload.
	const txInfo = decode(tx, {
		metadataRpc,
		registry,
	});
	console.log(
		`\nDecoded Transaction\n  To: ${
			(txInfo.method.args.dest as { id: string }).id
		}\n  Amount: ${txInfo.method.args.value}\n`,
	);

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
