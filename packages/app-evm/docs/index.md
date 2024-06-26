# Evm App

Package name: `@cypherock/sdk-app-evm`

This package allows you to invoke all the device operations related to the
EVM coin family.

## 1. Supported Coins

- Ethereum: (ChainId: `1`)
- Polygon: (ChainId: `137`)
- Binance: (ChainId: `56`)
- Fantom: (ChainId: `250`)
- Avalanche: (ChainId: `43114`)
- Arbitrum: (ChainId: `42161`)
- Optimism: (ChainId: `10`)
- Base: (ChainId: `8453`)

## 2. Usage

Install packages: `npm i @cypherock/sdk-app-evm @cypherock/sdk-hw-webusb ethers eip-712`

```ts
// NOTE: you can also use `@cypherock/sdk-hw-hid` dependending on the environment
import { DeviceConnection } from '@cypherock/sdk-hw-webusb';
import { EvmApp, setEthersLib, setEip712Lib } from '@cypherock/sdk-app-evm';

import { ethers } from 'ethers';
import * as eip712 from 'eip-712';

// Inject dependencies
setEthersLib(ethers);
setEip712Lib(eip712);

const connection = await DeviceConnection.create();
const evmApp = await EvmApp.create(connection);
```

## 3. Static Methods

### 3.1. `async EvmApp.create()`

Creates an instance of `EvmApp`.

**Arguments**: `None`

**Result**: `Promise<EvmApp>`

**Example:**

```ts
const evmApp = await EvmApp.create();
```

## 4. Methods

### 4.1. `async evmApp.getPublicKeys(params)`

Fetches the public keys / addresses of the provided derivation paths and chain.

**Arguments**:<br/>
`params`: `IGetPublicKeysParams`

```ts
type GetPublicKeysEventHandler = (event: GetPublicKeysEvent) => void;

interface IGetPublicKeysParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPaths: IGetPublicKeysDerivationPath[];
  chainId: number;
}
```

**Result**: `Promise<IGetPublicKeysResult>`

```ts
interface IGetPublicKeysResult {
  publicKeys: string[];
  addresses: string[];
}
```

**Example:**

```ts
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

console.log(addresses);
```

### 4.2. `async evmApp.getUserVerifiedPublicKey(params)`

Fetches the public key / address of the provided derivation path and chain.
It'll ask the user to verify the address generated on the device.

**Arguments**:<br/>
`params`: `IGetUserVerifiedPublicKeyParams`

```ts
interface IGetUserVerifiedPublicKeyParams {
  onEvent?: GetPublicKeysEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  chainId: number;
}
```

**Result**: `Promise<IGetUserVerifiedPublicKeyResult>`

```ts
interface IGetUserVerifiedPublicKeyResult {
  publicKey: string;
  address: string;
}
```

**Example:**

```ts
const { address } = evmApp.getUserVerifiedPublicKey({
  walletId: selectedWallet.id,
  // m/44'/60'/0'/0/0
  derivationPath: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
  chainId: 1,
});

console.log(address);
```

### 4.3. `async evmApp.signTxn(params)`

Sign the transaction with the provided derivation path and chain.

**Arguments**:<br/>
`params`: `ISignTxnParams`

```ts
type SignTxnEventHandler = (event: SignTxnEvent) => void;

interface ISignTxnParams {
  onEvent?: SignTxnEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];

  // The unsigned transaction to sign in hex format
  txn: string;

  // If true, the result will also contain `serializedTxn`
  serializeTxn?: boolean;
}
```

**Result**: `Promise<ISignTxnResult>`

```ts
interface ISignTxnResult {
  signature: {
    r: string;
    s: string;
    v: string;
  };

  serializedTxn?: string;
}
```

**Example:**

```ts
const { serializedTxn } = evmApp.signTxn({
  walletId: selectedWallet.id,
  // m/44'/60'/0'/0/0
  derivationPath: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
  txn: unsignedTxn,
  serializeTxn: true,
});

console.log(serializedTxn);
```

### 4.4. `async evmApp.signPersonalMsg(params)`

Sign the personal message with the provided derivation path and chain.
<a href="https://eips.ethereum.org/EIPS/eip-191" target="_blank">EIP-191</a>

Usually the message is human redable.

**Arguments**:<br/>
`params`: `ISignPersonalMsgParams`

```ts
interface ISignPersonalMsgParams {
  onEvent?: SignMsgEventHandler;

  walletId: Uint8Array;
  derivationPath: number[];
  // hex string
  message: string;
}
```

**Result**: `Promise<ISignMsgResult>`

```ts
interface ISignMsgResult {
  signature: {
    r: string;
    s: string;
    v: string;
  };

  // hex string
  serializedSignature: string;
}
```

**Example:**

```ts
const { serializedSignature } = evmApp.signPersonalMsg({
  walletId: selectedWallet.id,
  // m/44'/60'/0'/0/0
  derivationPath: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
  message:
    '0x74657374696e67207465787420666f72207369676e696e6720706572736f6e616c206d657373616765',
});

console.log(serializedSignature);
```

### 4.5. `async evmApp.signEthMsg(params)`

Same as `signPersonalMsg`, but in this case the message is not human redable
and will be displayed as is on the device.

### 4.6. `async evmApp.signTypedMsg(params)`

Sign the typed data message with the provided derivation path and chain.
<a href="https://eips.ethereum.org/EIPS/eip-712" target="_blank">EIP-712</a>

**Arguments**:<br/>
`params`: `ISignTypedParams`

```ts
interface ISignTypedParams {
  onEvent?: SignMsgEventHandler;
  walletId: Uint8Array;
  derivationPath: number[];
  // From `eip-712` npm package
  message: EIP712TypedData;
}
```

**Result**: `Promise<ISignMsgResult>`

```ts
interface ISignMsgResult {
  signature: {
    r: string;
    s: string;
    v: string;
  };

  // hex string
  serializedSignature: string;
}
```

**Example:**

```ts
const { serializedSignature } = evmApp.signTypedMsg({
  walletId: selectedWallet.id,
  // m/44'/60'/0'/0/0
  derivationPath: [0x80000000 + 44, 0x80000000 + 60, 0x80000000, 0, 0],
  message: typedData,
});

console.log(serializedSignature);
```
