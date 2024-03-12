# Welcome to Cypherock SDK Documentation

## Introduction

Cypherock SDK allows applications to connect with
<a href="https://www.cypherock.com" target="_blank">**Cypherock X1**</a> 
hardware wallet and access its capabilities without exposing the seed phrase.

Programming Language: `JavaScript`

## Connectivity

Developers can connect to **Cypherock X1** hardware wallet using the following
technologies:

| Technology                                                            | Supported Platform                  | Package                                                |
| --------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| [WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) | Web Apps                            | [@cypherock/sdk-hw-webusb](../cypherock-sdk-hw-webusb) |
| [HID](https://www.npmjs.com/package/node-hid)                         | Desktop Apps with NodeJS/ElectronJS | [@cypherock/sdk-hw-hid](../cypherock-sdk-hw-hid)       |

## Supported Coins

| Coin Family | Coins                                                                                       | Package                                                  |
| ----------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Bitcoin     | - Bitcoin (Legacy & Native Segwit)<br>- Litecoin<br>- Dogecoin<br>- Dashcoin                | [@cypherock/sdk-app-btc](../cypherock-sdk-app-btc)       |
| EVM         | - Ethereum<br>- Polygon<br>- Binance<br>- Fantom<br>- Avalanche<br>- Arbitrum<br>- Optimism | [@cypherock/sdk-app-evm](../cypherock-sdk-app-evm)       |
| Solana      | - Solana                                                                                    | [@cypherock/sdk-app-solana](../cypherock-sdk-app-solana) |
| Near        | - Near                                                                                      | [@cypherock/sdk-app-near](../cypherock-sdk-app-near)     |
