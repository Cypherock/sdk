# Manager Application

Contains all the common operations present on Cypherock X1 hardware wallet.

## 1. Get Device Info

- Description: Get the details of the connected device
- Parameters: `None`
- Result:
  ```ts
  {
    deviceSerial: string; // Unique identifier of the device
    firmwareVersion: string; // Firmware version which is installed
  }
  ```

## 2. Import Wallets

**Wallet**: Represents a BIP39 wallet present on Cypherock X1 hardware.
Each Cypherock X1 hardware can contain upto 4 wallets

- Description: Get details of all the available wallet present on the device.
- Parameters: `None`
- Result:
  ```ts
  Array<{
    walletId: string; // Unique identifier for the wallet
    name: string; // Name of the wallet as on device
    hasPin: boolean; // If the wallet has pin enabled
    hasPassphrase: boolean; // If the wallet has passphrase enabled
  }>;
  ```
