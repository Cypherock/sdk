# Transport Class for X1 Devices

The Transport  class is designed to handle interactions with X1 devices using the WebUSB API. It provides methods for detecting, identifying, and setting up X1 devices and handles various error scenarios that may occur during the process.

Table of Contents

- [Introduction](#introduction)
- [Class Definition](#class-definition)
- [Constructor](#constructor)
- [Methods](#methods)
  - [getX1DeviceWithTimeout](#getX1devicewithtimeout)
  - [identifyUSBProductId](#identifyusbproductid)
  - [setupX1Device](#setupX1device)
  - [handleX1DeviceDetection](#handleX1devicedetection)
  - [create](#create)

## Introduction

The `Transport` class is a comprehensive solution for interacting with X1 devices over the WebUSB API. It is designed to simplify detecting and identifying X1 devices, handling device setup, and managing errors that might occur during these operations. The class includes several methods to facilitate these tasks.

## Class Definition

```typescript
class Transport {
  // Class properties and methods
}
```

## Constructor

The constructor for the `Transport` class initializes the `device` property. If a `USBDevice` is provided as a parameter, it is assigned to the `device` property; otherwise, the `device` property is set to `null`.

```typescript
constructor(device?: USBDevice) {
  this.device = device || null;
}
```

## Methods

### getX1DeviceWithTimeout

The `getX1DeviceWithTimeout` method returns the first connected X1 device or `null` if none is found within the specified timeout (in milliseconds).

```typescript
async getX1DeviceWithTimeout(timeout: number): Promise<USBDevice | null>
```

### identifyUSBProductId

The `identifyUSBProductId` method takes the USB product ID as an input parameter and returns the corresponding device model string.

```typescript
identifyUSBProductId(productId: number): string
```

### setupX1Device

The `setupX1Device` method sets up the X1 device by opening the WebUSB device, selecting device configuration, resetting the device, finding the correct interface, and claiming the interface. An event listener is added to handle device disconnections.

```typescript
async setupX1Device(deviceInfo: X1DeviceInfo): Promise<USBDevice>
```

### handleX1DeviceDetection

The `handleX1DeviceDetection` method handles X1 device detection by calling the `setupX1Device()` method when a device is detected. If an error occurs during the device detection, an appropriate error is thrown.

```typescript
async handleX1DeviceDetection(
  detectedDevice: X1DeviceInfo | null,
  error: Error | null
): Promise<X1DeviceInfo>
```

### create

The `create` static method creates a new instance of the `Transport` class with the first connected X1 device or rejects with an error if none is found within the specified timeout or if there's an error during device detection.

```typescript
static async create(timeout?: number): Promise<Transport>
```