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
import { createServiceLogger } from './logger';

import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import {
	construct,
	// decode,
	deriveAddress,
	getRegistry,
	methods,
	PolkadotSS58Format,
 	createMetadata, 
	OptionsWithMeta 
} from '@substrate/txwrapper-polkadot'; 
import { KeyringPair } from '@polkadot/keyring/types';
import { 
  EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';

function signWith(
	pair: KeyringPair,
	signingPayload: string,
	options: OptionsWithMeta,
  ): `0x${string}` {
	const { registry } = options;
  
	const { signature } = registry
	  .createType('ExtrinsicPayload', signingPayload, {
		version: EXTRINSIC_VERSION,
	  })
	  .sign(pair);
  
	return signature as unknown as `0x${string}`;
}
const convertToJson = (data: any) => JSON.parse(JSON.stringify(data));

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

  // Establish websocket connection
  const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  const dest = '5CSbZ7wG456oty4WoiX6a1J88VUbrCXLhrKVJ9q95BsYH4TZ';
  const amount = 1; // WND

  // To verify
  const verify = false;
  const keyring = new Keyring();
  const pair = keyring.addFromUri('spread sword village control response joke phrase share merit miss door canoe setup surge remind tiger increase sphere busy hand scrap diesel hair bomb', { name: 'mnemonic' }, 'ed25519');

  // Get meta data
  const blockNumber:number = convertToJson(await api.rpc.chain.getBlock()).block.header.number;
  const blockHash = (await api.rpc.chain.getBlockHash(blockNumber)).toHex();
  const genesisHash = api.genesisHash.toHex()
  const metadataRpc:any = convertToJson(await api.rpc("state_getMetadata"));
  const { specVersion, transactionVersion, specName }:any = await api.rpc.state.getRuntimeVersion();
  const chain = await api.rpc.system.chain();

  const registry = getRegistry({
    chainName: chain.toString(),
    specName: specName,
    specVersion: specVersion,
    metadataRpc: metadataRpc
  });
  registry.setMetadata(createMetadata(registry, metadataRpc));

  // Public key from device
  const bittensorPubKey = (await bittensorApp.getPublicKeys({
    walletId: wallet.id,
    derivationPaths: [{path: [0x80000000 + 44, 0x80000000 + 354, 0x80000000, 0x80000000]}],
  })).publicKeys[0];
  console.log(`\nPublic Key expected: ${bittensorPubKey}`);
  
  // Calculate account id / address
  const bittensorAddressBit = deriveAddress(`0x${bittensorPubKey}`, PolkadotSS58Format.westend);
  console.log(`\nAddress device: ${bittensorAddressBit}`);

  let addressBit = deriveAddress(pair.publicKey, PolkadotSS58Format.westend);
	console.log(`\nAddress expected: ${addressBit}`);

  // Get nonce
  const nonce:number = await api.call.accountNonceApi.accountNonce(addressBit);
	console.log({nonce});

  // Pubkey Verify - done on device
  if (verify === true){
    const publicKey = Buffer.from(pair.publicKey).toString('hex');
    console.log(`\nPublic Key expected: ${publicKey}`);
    addressBit = deriveAddress(pair.publicKey, PolkadotSS58Format.substrate);
    console.log(`\nAddress expected: ${addressBit}`);
  }

  // Construct unsigned payload
	const unsigned = methods.balances.transferKeepAlive(
		{
			value: amount,
			dest: { id: dest },
		},
		{
			address: bittensorAddressBit,
			blockHash,
			blockNumber,
			eraPeriod: 64,
			genesisHash,
			metadataRpc,
			nonce,
			specVersion,
			tip: 0,
			transactionVersion,
		},
		{
			metadataRpc,
			registry,
		},
	);	
  
	// Construct unsigned txn payload
	const signingPayload = construct.signingPayload(unsigned, { registry });
	console.log(`\nPayload to Sign: 0x${signingPayload.substring(4)}`);

  // Signature from device
  const resultSig = await bittensorApp.signTxn({
    derivationPath: [0x80000000 + 44, 0x80000000 + 354, 0x80000000, 0x80000000],
    txn: `0x${signingPayload.substring(4)}`,
    walletId: wallet.id,
  });
  console.log(`\nSignature actual: 0x00${resultSig.signature}`);
  console.log(`\nDestination address: ${dest}`);
  console.log(`\nAmount: ${amount}`);

  if (verify === true){
    // Signature verify
    const signature = signWith(pair, signingPayload, {
      metadataRpc,
      registry,
    });
    console.log(`\nSignature expected: ${signature}`);
  

  // Serialize a signed transaction.
	const tx = construct.signedTx(unsigned, `0x00${resultSig.signature}`, {
		metadataRpc,
		registry,
	});
	console.log(`\nTransaction to Submit: ${tx}`);

	// Derive the tx hash of a signed transaction offline and through rpc
	const expectedTxHash = construct.txHash(tx);
	console.log(`\nTx Hash expected: ${expectedTxHash}`);
	const actualTxHashdevice = await api.rpc.author.submitExtrinsic(tx);
	console.log(`Tx Hash actual device: ${actualTxHashdevice}`);
}

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

}

run();
