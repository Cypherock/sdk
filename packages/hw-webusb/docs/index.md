# WebUSB DeviceConnection

Package name: `@cypherock/sdk-hw-webusb`

This package allows you to connect with the Cypherock X1 hardware wallet with
[WebUSB](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) protocol.

Supported Platform includes `Browser`

## 1. Usage

```ts
import DeviceConnection from '@cypherock/sdk-hw-webusb';

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

### 2.2. `async DeviceConnection.connect(device: USBDevice)`

Creates a connection instance of the provided device.

**Arguments**:<br/>
`device`: `USBDevice`

**Result**: `Promise<DeviceConnection>`

**Example:**

```ts
const deviceList = await navigator.usb.getDevices(filters);

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

**Arguments**: `None`

**Result**: `Promise<void>`

**Example:**

```ts
await connection.destroy();
```

## 4. Methods you won't need in most cases

Documentation pending
