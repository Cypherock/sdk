# HID DeviceConnection

Package name: `@cypherock/sdk-hw-hid`

This package allows you to connect with the Cypherock X1 hardware wallet with
[HID](https://www.npmjs.com/package/node-hid) protocol.

Supported Platform includes `NodeJS`, `Electron`

## 1. Usage

```ts
import DeviceConnection from '@cypherock/sdk-hw-hid';

const connection = await DeviceConnection.create();
```

## 2. Static Methods

### 2.1. `async DeviceConnection.create()`

Creates a connection instance of the connected Cypherock X1 hardware wallet.
Throws error if no device connection is available.

**Arguments**: `None`

**Result**: `Promise<DeviceConnection>`

**Example:**

```ts
const connection = await DeviceConnection.create();
```

### 2.2. `async DeviceConnection.list()`

Lists all the connected Cypherock X1 devices

**Arguments**: `None`

**Result**: `Promise<IDevice[]>`

**Example:**

```ts
const deviceList = await DeviceConnection.list();
```

### 2.3. `async DeviceConnection.connect(device: IDevice)`

Creates a connection instance of the provided device.

**Arguments**:<br/>
`device`: `IDevice`

**Result**: `Promise<DeviceConnection>`

**Example:**

```ts
const deviceList = await DeviceConnection.list();

if (deviceList.length === 0) {
  throw new Error('No device found');
}

const connection = await DeviceConnection.connect(deviceList[0]);
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
