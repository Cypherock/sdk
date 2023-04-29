# Near Application

## 1. Generate Address

- **Description**: Generate and return an address for the specified wallet and derivation path.
- **Parameters**:

  ```ts
  {
    // Specify the wallet to use
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/397'/0'/0'/1'
     */
    derivationPath: string;
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
     * Ex: m/44'/397'/0'/0'/1'
     */
    derivationPath: string;

    // The unsigned transaction to sign in hex
    transaction: string;
  }
  ```

- **Result**:

  ```ts
  {
    // Generated signatures for each input
    signature: string;

    // Serialized signed transaction
    signedTxn: string;
  }
  ```
