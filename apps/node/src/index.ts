import DeviceConnection, {
  updateLogger as updateLoggerHid,
} from '@cypherock/sdk-hw-hid';
import DeviceConnectionSerialport from '@cypherock/sdk-hw-serialport';
import {
  IWalletItem,
  ManagerApp,
  updateLogger,
} from '@cypherock/sdk-app-manager';
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
import {
  ISignTxnInvokeTxn,
  ISignTxnUnsignedTxn,
  setStarknetApiJs,
  StarknetApp,
} from '@cypherock/sdk-app-starknet';
// import { ethers } from 'ethers';
import { createServiceLogger } from './logger';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import dotEnv from 'dotenv-flow';
import { Account } from 'starknet';

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
const provider = new starknetApiJs.RpcProvider({
  nodeUrl:
    'https://starknet-sepolia.infura.io/v3/9643040ea0d04fd0ac5a38cb5f025b02',
});
// const chainId = starknetApiJs.constants.StarknetChainId.SN_SEPOLIA;

// Select Stark Wallet
const wallet_index = 2;

// Stark Sepolia Account Index (Account to be deployed)
// Note: Account once deployed will not be deployed again and will error, therefore change index
const sourceAddressIindex = 0;
const recipientAddress =
  '0x01eA6eE0440818419382E88536845f0De91cee361bFDE70d1FE57FC42677ca8F';
const amount = starknetApiJs.cairo.uint256(5 * 10 ** 8); // Amount in Cairo format
const amountStr = '0x1dcd6500';
const unit = 'strk'; // or "eth"

// Select ETH/STRK and Contract Info
const contractAXclassHash =
  '0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f';
const strkContractAddress =
  '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';
const ethContractAddress =
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

let contractAddress = ethContractAddress;
if (unit == 'strk') {
  contractAddress = strkContractAddress;
}

// *********************************************************************************//

const contracts: {
  eth: starknetApiJs.Contract | null;
  strk: starknetApiJs.Contract | null;
} = { eth: null, strk: null };

function formatBalance(qty: bigint, decimals: number): string {
  const balance = String('0').repeat(decimals) + qty.toString();
  const rightCleaned = balance.slice(-decimals).replace(/(\d)0+$/gm, '$1');
  const leftCleaned = BigInt(
    balance.slice(0, balance.length - decimals),
  ).toString();
  return leftCleaned + '.' + rightCleaned;
}

async function initContracts() {
  if (!contracts['eth']) {
    contracts['eth'] = new starknetApiJs.Contract(
      (await provider.getClassAt(ethContractAddress)).abi,
      ethContractAddress,
      provider,
    );
  }

  if (!contracts['strk']) {
    contracts['strk'] = new starknetApiJs.Contract(
      (await provider.getClassAt(strkContractAddress)).abi,
      strkContractAddress,
      provider,
    );
  }
}

// ================ Starknet App -- Account balance and state ========== //
async function fetchBalances(accountAXAddress: string) {
  await initContracts();
  const ethBalance = (await contracts.eth!.balanceOf(
    accountAXAddress,
  )) as bigint;
  const strkBalance = (await contracts.strk!.balanceOf(
    accountAXAddress,
  )) as bigint;

  return [
    formatBalance(ethBalance, 18) + ' ETH',
    formatBalance(strkBalance, 18) + ' STRK',
  ];
}

// // ================ Starknet App -- Account fetching ========== //
async function fetchAccount(connection: IDeviceConnection) {
  const managerApp = await ManagerApp.create(connection);

  const wallet = (await managerApp.getWallets()).walletList[wallet_index];
  // TODO: Give choice to user for wallet name & account number

  const starkApp = await StarknetApp.create(connection);
  const starkKeyPubAX = (
    await starkApp.getPublicKeys({
      walletId: wallet.id,
      derivationPaths: [
        {
          path: [
            0x80000000 + 0xa55,
            0x80000000 + 0x4741e9c9,
            0x80000000 + 0x447a6028,
            0x80000000,
            0x80000000,
            0xc,
          ],
        },
      ],
    })
  ).publicKeys[0];

  const constructorAXCallData = starknetApiJs.CallData.compile([
    starkKeyPubAX,
    0,
  ]);
  const accountAXAddress = starknetApiJs.hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    contractAXclassHash,
    constructorAXCallData,
    0,
  );
  console.log('Your Starknet address is : ', { accountAXAddress });

  // TODO: Give choice to user
  return { accountAXAddress, starkKeyPubAX, wallet };
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
function addPercent(number: any, percent = 50) {
  const bigIntNum = BigInt(number);
  return bigIntNum + (bigIntNum * BigInt(percent)) / BigInt(100);
}
function toBigInt(value: any) {
  return BigInt(value);
}
function removeHexPrefix(hex: any) {
  return hex.replace(/^0x/i, '');
}
function addHexPrefix(hex: any) {
  return `0x${removeHexPrefix(hex)}`;
}
function toHex(value: any) {
  return addHexPrefix(toBigInt(value).toString(16));
}
// ================ Starknet App -- Fund Transfer ========== //
async function transfer(connection: IDeviceConnection, wallet: IWalletItem) {
  const starkApp = await StarknetApp.create(connection);
  const starkKeyPubAX = '0x0';
  // await starkApp.getUserVerifiedPublicKey({
  //   walletId: wallet.id,
  //   derivationPath: [
  //     0x80000000 + 0xa55,
  //     0x80000000 + 0x4741e9c9,
  //     0x80000000 + 0x447a6028,
  //     0x80000000,
  //     0x80000000,
  //     0xc,
  //   ],
  // });
  console.log('Public key: ', starkKeyPubAX);
  const accountAXAddress =
    '0x7b419b63869cd1e23f0354aed454b8fe2908afbe6386f2a29a508f9d34da4d9';
  const starknetPrivateKey =
    '0x57260b0928dc7e15ada8911af893ca7e93b0ed14a3786288c73a6572f75214f';
  const account = new Account(provider, accountAXAddress, starknetPrivateKey);

  const constructorAXCallData = starknetApiJs.CallData.compile([
    0,
    starkKeyPubAX,
    1,
  ]);
  console.log('Transfering from : ', { accountAXAddress });

  const txnVersion = 1;
  const maxFee = 0x8110e6d36a8;
  const nonce = await provider.getNonceForAddress(accountAXAddress);

  const callDatauint = [
    hexToUint8Array('0x01'),
    hexToUint8Array(ethContractAddress),
    hexToUint8Array(
      '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e',
    ), // hash.getSelectorFromName('transfer')
    hexToUint8Array('0x03'),
    hexToUint8Array(recipientAddress),
    hexToUint8Array('0x0002dace9d900000'),
    hexToUint8Array('0x00'),
  ];
  const callData = [
    '0x01',
    ethContractAddress,
    '0x83afd3f4caedc6eebf44246fe54e38c95e3179a5ec9ea81740eca5b482d12e', // hash.getSelectorFromName('transfer')
    '0x03',
    recipientAddress,
    '0x0002dace9d900000',
    '0x00',
  ];
  const feeResponse = await account.estimateInvokeFee(
    [
      {
        contractAddress: contractAddress,
        calldata: [
          recipientAddress, // recipient address
          '0x0002dace9d900000', // transfer amount in wei
          '0x00',
        ],
        entrypoint: 'transfer',
      },
    ],
    {
      version: '0x3',
    },
  );

  const fee_estimate = feeResponse;
  const resource_bounds = {
    l2_gas: { max_amount: '0x0', max_price_per_unit: '0x0' },
    l1_gas: {
      max_amount: toHex(addPercent(fee_estimate.gas_consumed)),
      max_price_per_unit: toHex(addPercent(fee_estimate.gas_price)),
    },
  };
  const chainId = await account.getChainId();

  const txn: any = {
    senderAddress: account.address,
    version: '0x3',
    compiledCalldata: callData,
    chainId: chainId,
    nonce: nonce,
    accountDeploymentData: [],
    nonceDataAvailabilityMode: 0,
    feeDataAvailabilityMode: 0,
    resourceBounds: resource_bounds,
    tip: 0,
    paymasterData: [],
  };

  const transferTxnHash =
    starknetApiJs.hash.calculateInvokeTransactionHash(txn); // hash.calculateDeployAccountTransactionHash()
  const mysig = starknetApiJs.ec.starkCurve.sign(
    transferTxnHash,
    starknetPrivateKey,
  );

  console.log('Singature', mysig);

  const txndevice: ISignTxnInvokeTxn = {
    senderAddress: hexToUint8Array(account.address),
    version: hexToUint8Array('0x3'),
    calldata: { value: callDatauint },
    chainId: hexToUint8Array(chainId),
    nonce: hexToUint8Array(nonce),
    accountDeploymentData: hexToUint8Array('0'),
    nonceDataAvailabilityMode: hexToUint8Array('0'),
    feeDataAvailabilityMode: hexToUint8Array('0'),
    resourceBound: {
      level1: {
        maxAmount: hexToUint8Array(resource_bounds.l1_gas.max_amount),
        maxPricePerUnit: hexToUint8Array(
          resource_bounds.l1_gas.max_price_per_unit,
        ),
      },
      level2: {
        maxAmount: hexToUint8Array(resource_bounds.l2_gas.max_amount),
        maxPricePerUnit: hexToUint8Array(
          resource_bounds.l2_gas.max_price_per_unit,
        ),
      },
    },
    tip: hexToUint8Array('0'),
    paymasterData: hexToUint8Array('0'),
  };
  const sig = await starkApp.signTxn({
    derivationPath: [
      0x80000000 + 0xa55,
      0x80000000 + 0x4741e9c9,
      0x80000000 + 0x447a6028,
      0x80000000,
      0x80000000,
      0xc,
    ],
    txn: {
      invokeTxn: txndevice,
    },
    walletId: wallet.id,
  });

  console.log('SIGNATURE', sig);
  const signature = [
    `0x${sig.signature.slice(0, 64)}`,
    `0x${sig.signature.slice(64, 128)}`,
  ];

  const signed_tx = {
    ...txn,
    signature: signature,
  };

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
