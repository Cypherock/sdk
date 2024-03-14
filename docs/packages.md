# Packages

Cypherock SDK is a set of packages that can be used to interact with the
Cypherock hardware wallet.

There are 3 different types of packages available:

1. **Cypherock SDK HW Connect**:
    - Packages name format: `@cypherock/sdk-hw-*`
    - These packages will allow you to connect to the Cypherock X1 Hardware
     Wallet with different technologies, like: WebUSB, HID

2. **Cypherock SDK Applications**:
    - Packages name format: `@cypherock/sdk-app-*`
    - The packages through which you will be able to invoke operations on the
     Cypherock X1 Hardware Wallet

3. **Cypherock SDK Utilities**:
    - These packages does not directly communicate with the device, but instead
     provide utility functions and types.

## 1. SDK HW Connect

These packages will allow you to connect to the Cypherock X1 Vault
with different technologies, like: WebUSB, HID.

These packages provide the low level connection to the hardware wallet.

Package name format: `@cypherock/sdk-hw-*`

### 1.1. [HW HID](../cypherock-sdk-hw-hid)

Package name: [`@cypherock/sdk-hw-hid`](../cypherock-sdk-hw-hid)

- This package allows you to connect with the Cypherock X1 hardware wallet with
  [HID](https://www.npmjs.com/package/node-hid) protocol.

### 1.2. [HW WebUSB](../cypherock-sdk-hw-webusb)

Package name: [`@cypherock/sdk-hw-webusb`](../cypherock-sdk-hw-webusb)

- This package allows you to connect with the Cypherock X1 hardware wallet with
  [WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) protocol.

### 1.3. [HW Serialport](../cypherock-sdk-hw-serialport)

Package name: [`@cypherock/sdk-hw-serialport`](../cypherock-sdk-hw-serialport)

- Used to update the firmware of the Cypherock X1 Hardware Vault

## 2. SDK Applications

These packages will allow you to invoke operations on the Cypherock X1 Vault.

Package name format: `@cypherock/sdk-app-*`

### 2.1. [Manager App](../cypherock-sdk-app-manager)

Package name: [`@cypherock/sdk-app-manager`](../cypherock-sdk-app-manager)

- Contains all operations present on Cypherock X1 hardware wallet
  which are not related to any coin.
- Example: Fetching wallets, authenticating device, fetching device info etc

### 2.2. [EVM App](../cypherock-sdk-app-evm)

Package name: [`@cypherock/sdk-app-evm`](../cypherock-sdk-app-evm)

- Contains all operations present on Cypherock X1 hardware wallet related to evm
  family coins

### 2.3. [BTC App](../cypherock-sdk-app-btc)

Package name: [`@cypherock/sdk-app-btc`](../cypherock-sdk-app-btc)

- Contains all operations present on Cypherock X1 hardware wallet related to btc
  family coins

### 2.4. [Near App](../cypherock-sdk-app-near)

Package name: [`@cypherock/sdk-app-near`](../cypherock-sdk-app-near)

- Contains all operations present on Cypherock X1 hardware wallet related to near
  coin

### 2.5. [Solana App](../cypherock-sdk-app-solana)

Package name: [`@cypherock/sdk-app-solana`](../cypherock-sdk-app-solana)

- Contains all operations present on Cypherock X1 hardware wallet related to solana
  coin

## 3. SDK Utilities

These packages does not directly communicate with the device, but instead
provide utility functions and types.

### 3.1 [Utils](../cypherock-sdk-utils)

Package name: [`@cypherock/sdk-utils`](../cypherock-sdk-utils)

- Contains utility functions

### 3.2 [Interfaces](../cypherock-sdk-interfaces)

Package name: [`@cypherock/sdk-interfaces`](../cypherock-sdk-interfaces)

- Contains all common interfaces and types

### 3.3 [Core](../cypherock-sdk-core)

Package name: [`@cypherock/sdk-core`](../cypherock-sdk-core)

- Contains helper functions to communicate with the device.
- Used by all SDK Applications
