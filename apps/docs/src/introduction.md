# Introduction

Cypherock SDK will allow crypto assets **service providers** to connect with
**Cypherock X1** hardware wallet and access it's capabilities without exposing
the seed phrase.

Programming Language: `JavaScript`

## Terminologies

- **Wallet**: Represents a BIP39 wallet present on Cypherock X1 hardware.
  Each Cypherock X1 hardware can contain upto 4 wallets

## Connectivity

Developers can connect to **Cypherock X1** hardware wallet using the following
technologies:

| Technology                                                            | Supported Platform                  |
| --------------------------------------------------------------------- | ----------------------------------- |
| [WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) | Web Apps                            |
| [HID](https://www.npmjs.com/package/node-hid)                         | Desktop Apps with NodeJS/ElectronJS |

## Supported Coins

| Coin Family | Coins                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Bitcoin     | - Bitcoin (Legacy & Native Segwit)<br>- Litecoin<br>- Dogecoin<br>- Dashcoin                                                   |
| EVM         | - Ethereum<br>- Polygon<br>- Binance<br>- Fantom<br>- Avalanche<br>- Harmony<br>- Ethereum Classic<br>- Arbitrum<br>- Optimism |
| Solana      | - Solana                                                                                                                       |
| Near        | - Near                                                                                                                         |
