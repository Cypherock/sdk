# WebApp Integration Example

Assuming you want to integrate Cypherock SDK in a website which needs to
get Ethereum address of the user.

You'll need to use the `WebUSB` [HW Connect](../hw_connect.md) with the [EVM](../apps/evm.md)
application.

> NOTE: All the packages mentioned below are not published yet
> and are subjected to change.

## Step 1: Import all required packages

```ts
import DeviceConnection from "@cypherock/sdk-hw-webusb";
import SDKCore from "@cypherock/sdk-core";
import ManagerApp from "@cypherock/sdk-app-manager";
import EVMApp from "@cypherock/sdk-app-evm";
```

## Step 2: Create device connection and sdk instance

```ts
// Creates a device connection. Throws error if no device connetion is found
const connection = await DeviceConnection.create();

// Creates instance of SDK core
const sdk = await SDKCore.create(connection);
```

## Step 3: Get all wallets from device

Using [Manager App](../apps/manager.md#2-import-wallet).

```ts
// Create manager app instance
const managerApp = await ManagerApp.create(sdk);

// Get all wallets available on device
const allWallets = await managerApp.getAllWallets();

// Ask the user to select a wallet they want to use
const wallet = await askUserToSelectAWallet(allWallets);
```

## Step 4: Get ETH address from selected wallet

Using [EVM App](../apps/evm.md#1-generate-address).

```ts
// Create evm app instance
const evmApp = await EVMApp.create(sdk);

// Get ETH address from Cypherock X1 hardware wallet
const result = await evmApp.generateAddress({
  walletId: wallet.walletId,
  derivationPath: "m/44'/60'/0'/0",
  chainId: 1,
});

console.log(result.address);
```
