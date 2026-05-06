/* eslint-disable class-methods-use-this */
import {
  IDeviceConnection,
  ConnectionTypeMap,
  DeviceState,
} from '@cypherock/sdk-interfaces';
import * as ExpoDevice from 'expo-device';
import { PermissionsAndroid } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { logger } from './logger';

export default class DeviceConnection implements IDeviceConnection {
  private readonly bleManager: BleManager;

  private availableDevices: Device[];

  private connectedDevice: Device | null;

  private readonly deviceState: DeviceState;

  private readonly initialized: boolean;

  private sequenceNumber: number;

  constructor() {
    this.bleManager = new BleManager();
    this.availableDevices = [];
    this.connectedDevice = null;
    this.deviceState = DeviceState.MAIN;
    this.initialized = true;
    this.sequenceNumber = 0;
  }

  public async getConnectionType() {
    return ConnectionTypeMap.BLE;
  }

  public static getAndroidPermissionList() {
    const perms = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

    if ((ExpoDevice.platformApiLevel ?? -1) >= 31) {
      perms.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );
    }

    return perms;
  }

  public getAvailableDevices() {
    return this.availableDevices;
  }

  public async startScanning() {
    this.availableDevices = [];

    await this.bleManager.startDeviceScan(null, null, (err, device) => {
      if (err) {
        logger.error('Failed to start BLE scan!');
        logger.error(err);
        return;
      }

      if (device?.name?.toLowerCase().includes('cypherock')) {
        const isDuplicate = (devices: Device[], nextDevice: Device) =>
          devices.findIndex(d => nextDevice.id === d.id) > -1;

        if (!isDuplicate(this.availableDevices, device)) {
          this.availableDevices = [...this.availableDevices, device];
        }

        logger.verbose(
          `Found '${device.name}' (${device.id}): '${device.manufacturerData}'`,
        );
      }
    });
  }

  public async stopScanning() {
    try {
      await this.bleManager.stopDeviceScan();
      this.availableDevices = [];
    } catch (e) {
      logger.warn('Error while stopping device scan');
      logger.warn(e);
    }
  }

  public async connect(device: Device) {
    try {
      await this.stopScanning();
      const deviceConnection = await this.bleManager.connectToDevice(device.id);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      this.connectedDevice = device;
    } catch (e) {
      logger.error('Error while connecting to the device');
      logger.error(e);
    }

    return true;
  }

  public async getDeviceState() {
    return this.deviceState;
  }

  public async isInitialized() {
    return this.initialized;
  }

  public async getNewSequenceNumber() {
    this.sequenceNumber += 1;
    return this.sequenceNumber;
  }

  public async getSequenceNumber() {
    return this.sequenceNumber;
  }

  /**
   * Returns if the device is connected or not
   */
  public async isConnected() {
    if (this.connectedDevice && (await this.connectedDevice.isConnected())) {
      return true;
    }

    return false;
  }

  /**
   * Destroyes the connection and stop listening to the data.
   */
  public async destroy() {
    try {
      if (!(await this.isConnected())) return;
      if (!this.connectedDevice) return; // Because typescript isn't smart enough, lol.

      await this.bleManager.cancelDeviceConnection(this.connectedDevice.id);
      this.connectedDevice = null;
    } catch (error) {
      logger.warn('Error while closing device connection');
      logger.warn(error);
    }
  }

  /**
   * Run this function before starting every operation on the device.
   * TODO(pegvin) - Implement this function
   */
  // eslint-disable-next-line
  public async beforeOperation() {}

  /**
   * Run this function after every operation on the device.
   * TODO(pegvin) - Implement this function
   */
  // eslint-disable-next-line
  public async afterOperation() {}

  /**
   * Writes a given data string (in hex) to the device.
   * TODO(pegvin) - Implement this function
   */
  public async send(data: Uint8Array) {
    logger.verbose(`Sending ${data.length} bytes...`);
  }

  /**
   * Receives data from the device.
   * TODO(pegvin) - Implement this function
   */
  public async receive() {
    return new Uint8Array(0);
  }

  /**
   * TODO(pegvin) - Implement this function
   */
  public async peek() {
    return [];
  }
}
