# Bitcoin Application

Supported coins from the bitcoin family are:

1. Bitcoin `Coin Index: 0`
2. Litecoin `Coin Index: 2`
3. Dogecoin `Coin Index: 3`
4. Dashcoin `Coin Index: 5`

## 1. Get Extended Public Key

- **Description**: Generate and return extended public key for the specified wallet
  at the specified derivation path.
- **Parameters**:

  ```ts
  {
    // Wallet id for which you need the extended public key
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/0'/0': Bitcoin Legacy
     *     m/44'/2'/0': Litecoin
     */
    derivationPath: string;
  }
  ```

- **Result**:
  ```ts
  {
    // Extended public key
    xpub: string;
  }
  ```

## 2. Generate Address

- **Description**: Generate and return an address for the specified wallet and derivation path.
- **Parameters**:

  ```ts
  {
    // Specify the wallet to use
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/0'/0'/0/0: Bitcoin Legacy address
     *     m/44'/2'/0'/0/0: Litecoin address
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

## 3. Sign Transaction

- **Description**: Create signature for a transaction
- **Parameters**:

  ```ts
  {
    // Specify the wallet to use
    walletId: string;

    /**
     * Specify the Derivation path to use.
     * Ex: m/44'/0'/0': Bitcoin Legacy
     *     m/44'/2'/0': Litecoin
     */
    derivationPath: string;

    // The transaction to sign
    transaction: {
      version?: number;
      locktime?: number;
      inputs: Array<{
          prevHash: string; 
          prevTx: string;
          prevIndex: number;
          value: string;
          scriptPubKey: string;
        }>;
      outputs: Array<{
          value: string;
          scriptPubKey: string;
        }>;

      /**
        * To avoid displaying change addresses as output to the user
        * you need to explicitly define change addresses
        */
      changeAddresses: Array<{
          index: number;
          derivationPath: string;
        }>
    }
  }
  ```

- **Result**:

  ```ts
  {
    // Generated signatures for each input
    signatures: string[];

    // Serialized signed transaction
    signedTxn: string;
  }
  ```
