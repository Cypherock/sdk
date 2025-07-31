# Manager App

Package name: `@cypherock/sdk-app-manager`

This package allows you to invoke all the device dependent operations.

## 1. Usage

Install packages: `npm i @cypherock/sdk-app-manager @cypherock/sdk-hw-webusb`

```ts
// NOTE: you can also use `@cypherock/sdk-hw-hid` dependending on the environment
import { DeviceConnection } from '@cypherock/sdk-hw-webusb';
import { ManagerApp } from '@cypherock/sdk-app-manager';

const connection = await DeviceConnection.create();
const managerApp = await ManagerApp.create(connection);
```

## 2. Static Methods

### 2.1. `async ManagerApp.create()`

Creates an instance of `ManagerApp`.

**Arguments**: `None`

**Result**: `Promise<ManagerApp>`

**Example:**

```ts
const managerApp = await ManagerApp.create();
```

### 2.2. `async ManagerApp.getLatestFirmware(params)`

Fetches the latest firmware of the device from the server for a specific channel.

**Arguments**:<br/>
`params`: `GetLatestFirmwareOptions`

```ts
import { FirmwareChannel } from '@cypherock/sdk-app-manager/lib/constants/firmware';

interface GetLatestFirmwareOptions {
  // The update channel to check. This is mandatory.
  channel: FirmwareChannel;

  // If true, downloads the firmware binary
  doDownload?: boolean;
  
  // If true, checks the prerelease channel instead
  prerelease?: boolean;
}
```

**Result**:`Promise<LatestFirmware>`

```ts
interface LatestFirmware {
  // Latest version
  version: string;

  // Latest firmware binary
  firmware?: Uint8Array;
}
```

**Example:**

```ts
import { FirmwareChannel } from '@cypherock/sdk-app-manager/lib/constants/firmware';

// To get MULTICOIN firmware:
const { firmware, version } = await ManagerApp.getLatestFirmware({
  channel: FirmwareChannel.MULTICOIN,
  doDownload: true,
});

// To get BTC_ONLY firmware:
const { firmware, version } = await ManagerApp.getLatestFirmware({
  channel: FirmwareChannel.BTC_ONLY,
  doDownload: true,
});
```

## 3. Methods

### 3.1. `async managerApp.getDeviceInfo()`

Fetches the connected device information.

**Arguments**: `None`

**Result**: `Promise<IGetDeviceInfoResultResponse>`

```ts
interface IGetDeviceInfoResultResponse {
  deviceSerial: Uint8Array;
  firmwareVersion: IVersion | undefined;
  isAuthenticated: boolean;
  appletList: ISupportedAppletItem[];
  isInitial: boolean;
  onboardingStep: OnboardingStep;
}
```

**Example:**

```ts
const deviceInfo = await managerApp.getDeviceInfo();

console.log(deviceInfo.firmwareVersion);
```

### 3.2. `async managerApp.getWallets()`

Fetches all the wallets present on the connected device.

**Arguments**: `None`

**Result**: `Promise<IGetWalletsResultResponse>`

```ts
interface IGetWalletsResultResponse {
  walletList: IWalletItem[];
}

interface IWalletItem {
  id: Uint8Array;
  name: string;
  hasPin: boolean;
  hasPassphrase: boolean;
  /**
   * This field determines whether the particular wallet is in usable state
   * It does not indicate why the wallet is not usable.
   */
  isValid: boolean;
}
```

**Example:**

```ts
const { walletList } = await managerApp.getWallets();

const walletNames = walletList.map(wallet => wallet.name);

console.log(walletNames.join(','));
```

### 3.3. `async managerApp.selectWallet()`

Asks the user to select a wallet on the device.

**Arguments**: `None`

**Result**: `Promise<ISelectWalletResultResponse>`

```ts
interface ISelectWalletResultResponse {
  wallet: IWalletItem | undefined;
}

interface IWalletItem {
  id: Uint8Array;
  name: string;
  hasPin: boolean;
  hasPassphrase: boolean;
  /**
   * This field determines whether the particular wallet is in usable state
   * It does not indicate why the wallet is not usable.
   */
  isValid: boolean;
}
```

**Example:**

```ts
const { wallet } = await managerApp.selectWallet();

console.log(wallet.name);
```

### 3.4. `async managerApp.destroy()`

Destroys the manager instance and the connection to the device.

**Arguments**: `None`

**Result**: `Promise<void>`

**Example:**

```ts
await managerApp.destroy();
```

### 3.5. `async managerApp.abort()`

Abort any existing operation running on the connected device.

**NOTE**: This can only abort operations which are triggered by the SDK.

**Arguments**: `None`

**Result**: `Promise<void>`

**Example:**

```ts
await managerApp.abort();
```

## 4. Methods you won't need in most cases

### 4.1. `managerApp.getSDKVersion()`

Fetches the SDK Protocol version currently in use with the connected device.

**NOTE**: You won't need this in most cases.

**Arguments**: `None`

**Result**: `boolean`

**Example:**

```ts
const sdkVersion = managerApp.getSDKVersion();
```

### 4.2. `managerApp.isSupported()`

Returns if the SDK protocol version is supported with the connected device.

**NOTE**: You won't need this in most cases. The compatibility check is done
automatically on each function call.

**Arguments**: `None`

**Result**: `boolean`

**Example:**

```ts
const isSupported = managerApp.isSupported();
```

### 4.3. `async managerApp.authDevice(params?)`

Authenticates the device from Cypherock Server to check if it's genuine.
Throws error if the device is not genuine.

**Arguments**:<br/>
`params?` (Optional): `IAuthDeviceParams`

```ts
type AuthDeviceEventHandler = (event: AuthDeviceStatus) => void;

interface IAuthDeviceParams {
  onEvent?: AuthDeviceEventHandler;
  // Email address of the user. If provided, the user will receive an email
  // containing the authentication result
  email?: string;
  cysyncVersion?: string;
}
```

**Result**: `Promise<void>`

**Example:**

```ts
await managerApp.authDevice({ email: 'test@email.com' });
```

### 4.4. `async managerApp.authCard(params?)`

Authenticates an X1 card from Cypherock Server to check if it's genuine.
Throws error if the card is not genuine.

**Arguments**:<br/>
`params?` (Optional): `IAuthCardParams`

```ts
type AuthCardEventHandler = (event: AuthCardStatus) => void;

interface IAuthCardParams {
  // The card number to authenticate
  cardNumber?: number;
  isPairRequired?: boolean;
  onEvent?: AuthCardEventHandler;
  // Email address of the user. If provided, the user will receive an email
  // containing the authentication result
  email?: string;
  cysyncVersion?: string;
  onlyFailure?: boolean;
  sessionId?: string;
}
```

**Result**: `Promise<{ sessionId?: string }>`

**Example:**

```ts
await managerApp.authCard({ email: 'test@email.com' });
```

### 4.5. `async managerApp.getLogs(onEvent?)`

Fetches the device logs from the connected device.

**Arguments**:<br/>
`onEvent?` (Optional): `GetLogsEventHandler`

```ts
type GetLogsEventHandler = (event: GetLogsStatus) => void;
```

**Result**: `Promise<string>`

**Example:**

```ts
const logs = await managerApp.getLogs();

console.log(logs);
```

### 4.6. `async managerApp.trainJoystick(onEvent?)`

Trains the user to use joystick on device. On CySync it's used during
the onboarding process.

**NOTE**: You won't need this in most cases.

**Arguments**:<br/>
`onEvent?` (Optional): `TrainJoystickEventHandler`

```ts
type TrainJoystickEventHandler = (event: TrainJoystickStatus) => void;
```

**Result**: `Promise<void>`

**Example:**

```ts
await managerApp.trainJoystick();
```

### 4.7. `async managerApp.trainCard(params)`

Trains the user to tap card on device. On CySync it's used during the
onboarding process.

**NOTE**: You won't need this in most cases.

**Arguments**:<br/>
`params`: `ITrainCardParams`

```ts
type TrainCardEventHandler = (event: TrainCardStatus) => void;

interface ITrainCardParams {
  // Callback should return true if the provided wallets were created by the user
  onWallets: (params: ITrainCardResult) => Promise<boolean>;
  onEvent?: TrainCardEventHandler;
}
```

**Result**: `Promise<ITrainCardResult>`

```ts
interface ITrainCardResult {
  walletList: IExistingWalletItem[];
  cardPaired: boolean;
}

interface IExistingWalletItem {
  id: Uint8Array;
  name: string;
}
```

**Example:**

```ts
await managerApp.trainCard({ onWallets: () => Promise.resolve(true) });
```

### 4.8. `async managerApp.updateFirmware(params)`

Updates the firmware of the connected device.

**NOTE**: Should be only used in environments where both `hw-hid` and
`hw-serialport` is supported.

**Arguments**:<br/>
`params`: `IUpdateFirmwareParams`

```ts
import { FirmwareChannel } from '@cypherock/sdk-app-manager/lib/constants/firmware';

type GetDevices = () => Promise<IDevice[]>;

type CreateDeviceConnection = (device: IDevice) => Promise<IDeviceConnection>;

type UpdateFirmwareEventHandler = (event: UpdateFirmwareStatus) => void;

interface IUpdateFirmwareParams {
  // The update channel. This determines which firmware is fetched if not provided directly.
  channel: FirmwareChannel;

  // The firmware binary
  firmware?: Uint8Array;

  // The version of the firmware binary provided
  version?: IVersion;

  // Function to create a connection to the device. Should support both
  // `hw-hid` and `hw-serialport`
  createConnection: CreateDeviceConnection;

  // Function to get a list of connected devices. Should support both
  // `hw-hid` and `hw-serialport`
  getDevices: GetDevices;

  onProgress?: (progress: number) => void;
  onEvent?: UpdateFirmwareEventHandler;
}
```

**Result**: `Promise<void>`

**Example:**

```ts
import { FirmwareChannel } from '@cypherock/sdk-app-manager/lib/constants/firmware';

// The client application should determine the device variant first.
// This can be done by calling managerApp.getDeviceInfo() and checking the `variant_str` property.
const deviceVariant = getVariantFromDevice(); // e.g., FirmwareChannel.BTC_ONLY

await managerApp.updateFirmware({ 
  channel: deviceVariant, 
  createConnection, 
  getDevices 
});
```
```