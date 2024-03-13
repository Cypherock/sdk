# Get Started

## Components

1. **Cypherock SDK HW Connect**: 
    - Packages name format: `@cypherock/sdk-hw-*`
    - These packages will allow you to connect to the Cypherock X1 Hardware 
      Wallet with different technologies, like: WebUSB, HID

2. **Cypherock SDK Applications**:
    - Packages name format: `@cypherock/sdk-app-*`
    - The packages through which you will be able to invoke operations on the
      Cypherock X1 Hardware Wallet

## 1. Select HW Connect Technology

This layer allows you to connect with the Cypherock X1 hardware wallet with
different technologies: WebUSB and HID.

You can use the below table to select between WebUSB and HID.

| Technology                                                            | Supported Platform                  | Package                                                |
| --------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| [WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) | Web Apps                            | [@cypherock/sdk-hw-webusb](../cypherock-sdk-hw-webusb) |
| [HID](https://www.npmjs.com/package/node-hid)                         | Desktop Apps with NodeJS/ElectronJS | [@cypherock/sdk-hw-hid](../cypherock-sdk-hw-hid)       |

## 2. Create Connection

All HW Connect packages export a `create` function which can be used to create
a connection instance of the connected Cypherock X1 hardware wallet.

Example:
```ts
// Import device connection
// NOTE: You can use @cypherock/sdk-hw-webusb for WebUSB 
import DeviceConnection from "@cypherock/sdk-hw-hid";

// Creates a device connection. Throws error if no device connetion is found
const connection = await DeviceConnection.create();
```

There are more methods in `DeviceConnection` which can be found in the 
documentation of the respective packages. For the sake of this example, 
we will only use the `create` method.

## 3. Select a Wallet

Since Cypherock X1 Vault supports multiple wallets, you will need to select
the wallet you want to use.

Using [@cypherock/sdk-app-manager](../cypherock-sdk-app-manager) we fetch a list
of all the wallets available on the device.

```ts
// Create manager app instance
const managerApp = await ManagerApp.create(connection);

// Get all wallets available on device
const allWallets = await managerApp.getWallets();

// Ask the user to select a wallet they want to use
const selectedWallet = await askUserToSelectAWallet(allWallets);
```

## 4. Execute Operation

For this example we will assume we want to get a list a ETH addresses from the
device. We will use the [EVM App](../cypherock-sdk-app-evm) to do that.

```ts
// Create evm app instance
const evmApp = await EVMApp.create(connection);

const { addresses } = evmApp.getPublicKeys({
        walletId: selectedWallet.id,
        derivationPaths: [
          {
            // m/44'/60'/0'/0/0
            path: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
          },
        ],
        chainId: 1,
    });
```

## 5. Destroy the connection

Once the device connection is no longer needed you should destroy it.

```ts
await connection.destroy();
```

**NOTE**

- Do not destroy the connection if you'll need to connect to the same device
  again.
- Destroying the application will also destroy the connection.

```ts
// This will destroy the device connection as well
await evmApp.destroy();
```
