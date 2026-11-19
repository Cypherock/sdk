# BLE DeviceConnection

Package name: `@cypherock/sdk-hw-ble`

This package allows you to connect with the Cypherock X1
hardware wallet via the BLE adapter.

Supported Platform includes `React Native (Android)` and
`React Native (iOS)`

## 1. Usage

Install packages: `npm i @cypherock/sdk-hw-ble`

```ts
import { DeviceConnection } from '@cypherock/sdk-hw-ble';

const connection = new DeviceConnection();
// Acquire appropriate permissions: DeviceConnection.getAndroidPermissionList()
await connection.startScanning();
await connection.connect(connection.getAvailableDevices()[0]);
```

## 2. Static Methods

### 2.1. `DeviceConnection.getAndroidPermissionList()`

Returns a list of permissions to be acquired before the module
is used.

**Arguments**: `None`

**Result**: `Permission[]`

**Example:**

```ts
const perms = DeviceConnection.getAndroidPermissionList();
perms.forEach(async perm => await PermissionsAndroid.request(perm));
```

## 3. Methods

### 3.1. `async connection.isConnected()`

Returns if the device is connected

**Arguments**: `None`

**Result**: `Promise<boolean>`

**Example:**

```ts
console.log(await connection.isConnected());
```

### 3.2. `async connection.getDeviceState()`

Returns the state of the device.

**Arguments**: `None`

**Result**: `Promise<DeviceState>`

```
enum DeviceState {
  BOOTLOADER,
  INITIAL,
  MAIN,
}
```

**Example:**

```ts
console.log(await connection.getDeviceState());
```

### 3.3. `async connection.destroy()`

Destroys the connection instance.

**NOTE**: Do not destroy the connection if you'll need to connect to the same
device again. Destroying and recreating connection on the same device may cause
issues on some platforms.

**Arguments**: `None`

**Result**: `Promise<void>`

**Example:**

```ts
await connection.destroy();
```

## 4. Methods you won't need in most cases

Documentation pending
