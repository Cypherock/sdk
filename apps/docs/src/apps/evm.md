# EVM Application

Supported coins from the evm family are:

1. Ethereum
2. Polygon
3. Binance
4. Fantom
5. Avalanche
6. Harmony
7. Ethereum Classic
8. Arbitrum
9. Optimism

## 1. Generate Address

- **Description**: Generate and return an address for the specified wallet and derivation path.
- **Parameters**:

  ```ts
  {
    // Specify the wallet to use
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/60'/0'/0: Ethereum Account 1
     *     m/44'/60'/1'/0: Ethereum Account 2
     */
    derivationPath: string;

    chainId: number;
  }
  ```

- **Result**:
  ```ts
  {
    // Generated address
    address: string;
  }
  ```

## 2. Sign Transaction

- **Description**: Create signature for a transaction
- **Parameters**:

  ```ts
  {
    // Specify the wallet to use
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/60'/0'/0: Ethereum Account 1
     *     m/44'/60'/1'/0: Ethereum Account 2
     */
    derivationPath: string;

    // The transaction to sign
    transaction: {
      nonce: string;
      gasPrice: string;
      gasLimit: string;
      to: string;
      chainId: number;
      value: string;
      data: string;
    }
  }
  ```

- **Result**:

  ```ts
  {
    // Generated signature
    signature: string;

    // Serialized signed transaction
    signedTxn: string;
  }
  ```

## 3. Sign Message ([`personal_sign`](https://eips.ethereum.org/EIPS/eip-191))

- **Description**: Generate eth signature on a given message
- **Parameters**:

  ```ts
  {
    // Specify the wallet to use
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/60'/0'/0: Ethereum Account 1
     *     m/44'/60'/1'/0: Ethereum Account 2
     */
    derivationPath: string;

    chainId: number;

    // The message to sign in hex
    message: string;

    // Set this if the message is human readable
    isHumanReadable?: boolean;
  }
  ```

- **Result**:
  ```ts
  {
    // Generated signature
    signature: string;
  }
  ```

## 4. Sign Typed Data ([`eth_signTypedData`](https://eips.ethereum.org/EIPS/eip-712))

- **Description**: Generate eth signature on a given message
- **Parameters**:

  ```ts
  {
    // Specify the wallet to use
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/60'/0'/0: Ethereum Account 1
     *     m/44'/60'/1'/0: Ethereum Account 2
     */
    derivationPath: string;

    chainId: number;

    // The data to sign
    data: EIP712DataObject;
  }
  ```

- **Result**:
  ```ts
  {
    // Generated signature
    signature: string;
  }
  ```
