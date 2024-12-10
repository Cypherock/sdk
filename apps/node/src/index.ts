import DeviceConnection, {
  updateLogger as updateLoggerHid,
} from '@cypherock/sdk-hw-hid';
import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import { IWalletItem, ManagerApp, updateLogger } from '@cypherock/sdk-app-manager';
import { updateLogger as updateLoggerCore } from '@cypherock/sdk-core';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
// import * as bitcoinJsLib from 'bitcoinjs-lib';
// import * as nearApiJs from 'near-api-js';
// import * as solanaWeb3 from '@solana/web3.js';
import * as starknetApiJs from 'starknet';
// import { setBitcoinJSLib } from '@cypherock/sdk-app-btc';
// import { setEthersLib } from '@cypherock/sdk-app-evm';
// import { setNearApiJs } from '@cypherock/sdk-app-near';
// import { setSolanaWeb3 } from '@cypherock/sdk-app-solana';
import { ISignTxnUnsignedTxn, setStarknetApiJs, StarknetApp } from '@cypherock/sdk-app-starknet';
// import { ethers } from 'ethers';
import { createServiceLogger } from './logger';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import dotEnv from 'dotenv-flow';

dotEnv.config();
const getEnvVariable = (key: string, defaultValue?: string): string => {
  let value: string | undefined;

  if (typeof process !== 'undefined' && process.env) {
    value = process.env[key];
  } else if (typeof window !== 'undefined' && (window as any).cysyncEnv) {
    value = (window as any).cysyncEnv[key];
  }

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`ENVIREMENT VARIABLE '${key}' NOT SPECIFIED.`);
};

// *************************** User-defined variables*******************************//

// Select RPC provider
// const provider = new starknetApiJs.RpcProvider({ nodeUrl: `https://starknet-sepolia.infura.io/v3/${getEnvVariable('INFURA_STARKNET_API_KEY', '')}` });
const provider = new starknetApiJs.RpcProvider({ nodeUrl: "https://starknet-sepolia.infura.io/v3/9643040ea0d04fd0ac5a38cb5f025b02" });
// const chainId = starknetApiJs.constants.StarknetChainId.SN_SEPOLIA;

// Select Stark Wallet
const wallet_index = 2;

// Stark Sepolia Account Index (Account to be deployed) 
// Note: Account once deployed will not be deployed again and will error, therefore change index
const sourceAddressIindex = 0; 
const recipientAddress = '0x07E008CA5F7759b67494921a6D9721c7D913BE60955Ae2E33f30295583939fd2'; // Stark Sepolia Account Address of index 1
const amount =  starknetApiJs.cairo.uint256(5 * (10**8)); // Amount in Cairo format 
const amountStr =  '0x1dcd6500';
const unit = "strk"; // or "eth"

// Select ETH/STRK and Contract Info
const contractAXclassHash = "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f";
const strkContractAddress = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
const ethContractAddress  = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

let contractAddress = ethContractAddress;
if (unit == "strk"){
  contractAddress = strkContractAddress;
}

// *********************************************************************************//

const contracts: {eth: starknetApiJs.Contract | null, strk: starknetApiJs.Contract | null} = {eth: null, strk: null};

function formatBalance(qty: bigint, decimals: number): string {
  const balance = String("0").repeat(decimals) + qty.toString();
  const rightCleaned = balance.slice(-decimals).replace(/(\d)0+$/gm, '$1');
  const leftCleaned = BigInt(balance.slice(0, balance.length - decimals)).toString();
  return leftCleaned + "." + rightCleaned;
}

async function initContracts() {
  if (!contracts['eth']) {
    contracts['eth'] = new starknetApiJs.Contract((await provider.getClassAt(ethContractAddress)).abi, ethContractAddress, provider);
  }

  if (!contracts['strk']) {
    contracts['strk'] = new starknetApiJs.Contract((await provider.getClassAt(strkContractAddress)).abi, strkContractAddress, provider);
  }
}

// ================ Starknet App -- Account balance and state ========== //
async function fetchBalances(accountAXAddress: string) {
  await initContracts();
  const ethBalance = await (contracts.eth!).balanceOf(accountAXAddress) as bigint;
  const strkBalance = await (contracts.strk!).balanceOf(accountAXAddress) as bigint;

  return [formatBalance(ethBalance, 18) + " ETH", formatBalance(strkBalance, 18) + " STRK"];
}

// // ================ Starknet App -- Account fetching ========== //
async function fetchAccount(connection: IDeviceConnection) {
  const managerApp = await ManagerApp.create(connection);

  const wallet = (await managerApp.getWallets()).walletList[wallet_index];
  // TODO: Give choice to user for wallet name & account number

  const starkApp = await StarknetApp.create(connection);
  const starkKeyPubAX = (await starkApp.getPublicKeys({
    walletId: wallet.id,
    derivationPaths: [{ path: [0x80000000 + 0xA55,
                     0x80000000 + 0x4741E9C9,
                     0x80000000 + 0x447A6028,
                     0x80000000,
                     0x80000000,
                     0xC] }]
  })).publicKeys[0];

  const constructorAXCallData = starknetApiJs.CallData.compile([starkKeyPubAX,0]);
  const accountAXAddress = starknetApiJs.hash.calculateContractAddressFromHash(starkKeyPubAX, contractAXclassHash, constructorAXCallData, 0);
  console.log("Your Starknet address is : ", {accountAXAddress});

  // TODO: Give choice to user
  return {accountAXAddress, starkKeyPubAX, wallet};
}

// // ================ Starknet App -- Account deploy if not already ========== //
// async function deployAddress(connection: IDeviceConnection, wallet: IWalletItem) {

//   const starkApp = await StarknetApp.create(connection);
//   const starkKeyPubAX = (await starkApp.getPublicKeys({
//     walletId: wallet.id,
//     derivationPaths: [{ path: [0x80000000 + 44, 0x80000000 + 9004, 0x80000000, 0, sourceAddressIindex] }]
//   })).publicKeys[0];

//   const constructorAXCallData = starknetApiJs.CallData.compile([starkKeyPubAX,0]);
//   const accountAXAddress = starknetApiJs.hash.calculateContractAddressFromHash(starkKeyPubAX, contractAXclassHash, constructorAXCallData, 0);
//   console.log("Deploying address : ", {accountAXAddress});

//   const txnVersion = 1;
//   const maxFee = 0x8110e6d36a8;
//   const deployAccountTxnHash = starknetApiJs.hash.calculateDeployAccountTransactionHash(
//     {
//       contractAddress: contractAddress,
//       classHash: contractAXclassHash,
//       compiledConstructorCalldata: constructorAXCallData,
//       salt: 0,
//       version: "0x3",
//       chainId: chainId,
//       nonce: 0,
//       nonceDataAvailabilityMode: 0,
//       feeDataAvailabilityMode: 0,
//       resourceBounds: {
//         l1_gas: { max_amount: "0x0000", max_price_per_unit: "0x0000" },
//         l2_gas: { max_amount: "0x0000", max_price_per_unit: "0x0000" }
//       },
//       tip: 0,
//       paymasterData: [],
//   });
//   const sig = await starkApp.signTxn({
//     derivationPath: [0x80000000 + 44, 0x80000000 + 9004, 0x80000000, 0, sourceAddressIindex],
//     txn: deployAccountTxnHash,
//     walletId: wallet.id,
//   });
//   console.log("sig : ", {sig});
//   const signature = [`0x${sig.signature.slice(0, 64)}`, `0x${sig.signature.slice(64, 128)}`];
//   const txn = await provider.deployAccountContract({
//     classHash: contractAXclassHash,
//     addressSalt: starkKeyPubAX,
//     constructorCalldata: constructorAXCallData,
//     signature: signature}, {
//       nonce: 0,
//       version: txnVersion,
//       maxFee: maxFee
//     });
  
//   console.log("Deploying txn : ", {txn});
//   return txn;
// }

// ================ Starknet App -- Fund Transfer ========== //
async function transfer(connection: IDeviceConnection, wallet: IWalletItem) {
  const starkApp = await StarknetApp.create(connection);
  const starkKeyPubAX = (await starkApp.getUserVerifiedPublicKey({
    walletId: wallet.id,
    derivationPath:  [0x80000000 + 0xA55,
      0x80000000 + 0x4741E9C9,
      0x80000000 + 0x447A6028,
      0x80000000,
      0x80000000,
      0xC]
  }));
  console.log("Public key: ", starkKeyPubAX)
  const constructorAXCallData = starknetApiJs.CallData.compile([0,starkKeyPubAX,1]);
  const accountAXAddress = "0x7b419b63869cd1e23f0354aed454b8fe2908afbe6386f2a29a508f9d34da4d9";//starknetApiJs.hash.calculateContractAddressFromHash(starkKeyPubAX, contractAXclassHash, constructorAXCallData, 0);
  console.log("Transfering from : ", {accountAXAddress});

  const txnVersion = 1;
  const maxFee = 0x8110e6d36a8;
  const nonce = await provider.getNonceForAddress(accountAXAddress);
  const callData = [
    contractAddress,
    starknetApiJs.hash.getSelectorFromName('transfer'),
    '0x3',
    recipientAddress,
    amountStr,
    '0x0'
  ];

  // const transferTxnHash = starknetApiJs.hash.calculateInvokeTransactionHash({
  //   senderAddress: accountAXAddress,
  //   version: "0x3",
  //   compiledCalldata: callData,
  //   chainId: chainId,
  //   nonce: nonce,
  //   accountDeploymentData: [],
  //   nonceDataAvailabilityMode: 0,
  //   feeDataAvailabilityMode: 0,
  //   resourceBounds: {
  //     l1_gas: { max_amount: "0x0000", max_price_per_unit: "0x0000" },
  //     l2_gas: { max_amount: "0x0000", max_price_per_unit: "0x0000" }
  //   },
  //   tip: 0,
  //   paymasterData: [],
  // });

  const txn : ISignTxnUnsignedTxn = {
    senderAddress:
      hexToUint8Array("0x07B419B63869CD1E23f0354AeD454b8fE2908AfBE6386f2a29A508f9d34Da4d9"),
    version: hexToUint8Array("0x3"),
    calldata: {value: [  hexToUint8Array("0x01")]},
    chainId: hexToUint8Array("0x2"),
    nonce: hexToUint8Array("0x2"),
    accountDeploymentData: hexToUint8Array("0x0"), // NULL
    nonceDataAvailabilityMode: hexToUint8Array("0x0"),
    feeDataAvailabilityMode: hexToUint8Array("0x0"),
    resourceBound: {
      level1: { maxAmount: hexToUint8Array("0x0"), maxPricePerUnit: hexToUint8Array("0x0") },
      level2: { maxAmount: hexToUint8Array("0x0"), maxPricePerUnit: hexToUint8Array("0x0") },
    },
    tip: hexToUint8Array("0x0"),
    paymasterData: hexToUint8Array("0x0"), // NULL
  };

  const sig = await starkApp.signTxn({
    derivationPath: [0x80000000 + 0xA55,
      0x80000000 + 0x4741E9C9,
      0x80000000 + 0x447A6028,
      0x80000000,
      0x80000000,
      0xC],
    txn: txn,
    walletId: wallet.id,
  });
  console.log("SIGNATURE", sig);
  const signature = [`0x${sig.signature.slice(0, 64)}`, `0x${sig.signature.slice(64, 128)}`];

  // const txn = await provider.invokeFunction({
  //   contractAddress: accountAXAddress,
  //   entrypoint: 'transfer',
  //   calldata: callData,
  //   signature: signature
  // }, {
  //   nonce: nonce,
  //   version: txnVersion,
  //   maxFee: maxFee
  // });
  // console.log("transferStrk : ", {txn});
  // return txn;
}

const run = async () => {
  updateLogger(createServiceLogger);
  updateLoggerCore(createServiceLogger);
  updateLoggerHid(createServiceLogger);

  // setBitcoinJSLib(bitcoinJsLib);
  // setEthersLib(ethers);
  // setNearApiJs(nearApiJs);
  // setSolanaWeb3(solanaWeb3);
  setStarknetApiJs(starknetApiJs);

  let connection: IDeviceConnection;

  try {
    connection = await DeviceConnection.create();
  } catch (error) {
    connection = await DeviceConnectionSerialport.create();
  }

  // const {accountAXAddress, wallet} = await fetchAccount(connection);
  // console.log(await fetchBalances(accountAXAddress));
  // console.log(await deployAddress(connection, wallet));
  // console.log(await fetchBalances(accountAXAddress));
  const managerApp = await ManagerApp.create(connection);
  const wallet = (await managerApp.getWallets()).walletList[1];

  console.log(await transfer(connection, wallet));
  // console.log(await fetchBalances(accountAXAddress));

  connection.destroy();
};

run();
