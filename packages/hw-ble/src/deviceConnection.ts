/* eslint-disable class-methods-use-this */
import {
  IDevice,
  ConnectionTypeMap,
  DeviceState,
  IDeviceConnection,
  PoolData,
} from '@cypherock/sdk-interfaces';
import * as ExpoDevice from 'expo-device';
import { PermissionsAndroid } from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
  Subscription,
  ScanOptions,
  ScanMode
} from 'react-native-ble-plx';
import * as uuid from 'uuid';
import { logger } from './logger';

const NUS_SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const NUS_RX_CHARACTERISTICS_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
const NUS_TX_CHARACTERISTICS_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
const DEVICE_STATUS_CHARACTERISTICS_UUID = `6E400004-B5A3-F393-E0A9-E50E24DCCA9E`;

let availableDevices: Device[] = [];

export default class DeviceConnection implements IDeviceConnection {
  private readonly initialized: boolean;

  private pool: PoolData[];

  private connectedDevice: Device;

  private deviceState: DeviceState;

  private sequenceNumber: number;

  private subscriptions: Subscription[];

  constructor(device: Device) {
    this.pool = [];
    this.connectedDevice = device;
    this.deviceState = DeviceState.INITIAL;
    this.initialized = true;
    this.sequenceNumber = 0;
    this.subscriptions = [
      this.connectedDevice.monitorCharacteristicForService(NUS_SERVICE_UUID, NUS_TX_CHARACTERISTICS_UUID, this.onDataFromTxChar, undefined, 'notification'),
      this.connectedDevice.monitorCharacteristicForService(NUS_SERVICE_UUID, DEVICE_STATUS_CHARACTERISTICS_UUID, this.onDataFromDeviceStatusChar, undefined, 'notification')
    ];
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

  public static async getAvailableDevices() : Promise<IDevice[]> {
    let devices: IDevice[] = [];

    for (const device of availableDevices) {
      const status = await DeviceConnection.getDeviceStatus(device);

      devices.push({
        path: device.id,
        deviceState: status === undefined ? DeviceState.INITIAL : status,
        productId: 0,
        vendorId: 0,
        serial: "",
        type: ConnectionTypeMap.BLE
      });
    }

    return devices;
  }

  public static async startScanning(mgr: BleManager) {
    availableDevices = [];

    const scanOpts: ScanOptions = {
      allowDuplicates: true,
      scanMode: ScanMode.LowLatency,
    }

    await mgr.startDeviceScan(null, scanOpts, (err, device) => {
      if (err) {
        logger.error('Failed to start BLE scan!', err);
        return;
      } else if (!device) {
        logger.warn('Scan callback called without any device!');
        return;
      }

      if (device.name?.toUpperCase().includes('X1 BLE')) {
        const isDuplicate = (devices: Device[], nextDevice: Device) =>
          devices.findIndex(d => nextDevice.id === d.id) > -1;

        if (!isDuplicate(availableDevices, device)) {
          availableDevices = [...availableDevices, device];
        }
      }
    });
  }

  public static async stopScanning(mgr: BleManager) {
    try {
      await mgr.stopDeviceScan();
      availableDevices = [];
    } catch (e) {
      logger.warn('Error while stopping device scan');
      logger.warn(e);
    }
  }

  public static async connect(mgr: BleManager, idevice: IDevice) {
    try {
      await this.stopScanning(mgr);

      const device = await mgr.connectToDevice(idevice.path);
      await device.discoverAllServicesAndCharacteristics();

      /* USB HID packets are 64 bytes (padded with zero if need be) thus
       * we need to ensure Bluetooth's each maximum transmission unit (MTU)
       * must be atleast 64 bytes (data) + 5 bytes (headers) = 69 bytes.
       */
      await mgr.requestMTUForDevice(device.id, 517);

      return new DeviceConnection(device);
    } catch (e) {
      logger.error('Error while connecting to the device');
      logger.error(e);
      throw e;
    }
  }

  public async getConnectionType() {
    return ConnectionTypeMap.BLE;
  }

  public async getDeviceState() {
    await this.fetchAndUpdateDeviceStatus();
    return this.deviceState;
  }

  public isInitialized() {
    return this.initialized;
  }

  public async getNewSequenceNumber() {
    this.sequenceNumber += 1;
    return this.sequenceNumber;
  }

  public async getSequenceNumber() {
    return this.sequenceNumber;
  }

  public async isConnected() {
    return await this.connectedDevice.isConnected();
  }

  public async destroy() {
    try {
      this.subscriptions.forEach(subscription => subscription.remove());
      this.subscriptions = [];

      await this.connectedDevice.cancelConnection();
    } catch (error) {
      logger.warn('Error while closing device connection');
      logger.warn(error);
    }

    logger.info(`Device ${this.connectedDevice.id} disconnected!`);
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

  // TODO(pegvin) - Check for ACK or resend the data if required.
  public async send(data: Uint8Array) {
    if (data.length < 1) {
      logger.error("Trying to write 0 bytes over BLE!", data);
      return;
    }

    /* 'MAIN' state uses HID, which communicates in 64-byte packets as
       compared to 'BOOTLOADER' state which is basically a serial port */
    if (this.deviceState === DeviceState.MAIN) {
      const dataToWrite = [...data, ...new Array(64 - data.length).fill(0x00)];
      this.connectedDevice?.writeCharacteristicWithoutResponseForService(
        NUS_SERVICE_UUID,
        NUS_RX_CHARACTERISTICS_UUID,
        Buffer.from(dataToWrite).toString('base64')
      );
    } else if (this.deviceState === DeviceState.BOOTLOADER) {
      this.connectedDevice?.writeCharacteristicWithoutResponseForService(
        NUS_SERVICE_UUID,
        NUS_RX_CHARACTERISTICS_UUID,
        Buffer.from(data).toString('base64')
      );
    } else {
      logger.error(`Trying to write ${data.length} bytes in 'INITIAL' state.`);
    }
  }

  public async receive() {
    return this.pool.shift()?.data;
  }

  public async peek() {
    return [...this.pool];
  }

  private static async getDeviceStatus(device: Device) : Promise<DeviceState | undefined> {
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();

      const char = await device.readCharacteristicForService(NUS_SERVICE_UUID, DEVICE_STATUS_CHARACTERISTICS_UUID); // Automatically fetches the latest data
      if (!char.value) {
        logger.error("Failed to read characteristic value!");
        return undefined;
      }

      const raw = Buffer.from(char.value, 'base64').readUint8();
      const state = DeviceConnection.parseDeviceStatus(raw).state;

      await device.cancelConnection();

      return state;
    } catch (e) {
      console.error('Failed to fetch device status', e);
    }

    return undefined;
  }

  private async fetchAndUpdateDeviceStatus() {
    if (this.connectedDevice) {
      const char = await this.connectedDevice.readCharacteristicForService(NUS_SERVICE_UUID, DEVICE_STATUS_CHARACTERISTICS_UUID); // Automatically fetches the latest data
      if (!char.value) {
        logger.error("Failed to read characteristic value!");
        return;
      }

      const status = Buffer.from(char.value, 'base64').readUint8();
      this.parseAndUpdateDeviceStatus(status);
    }
  }

  private static parseDeviceStatus(deviceStatus: number) {
    const is_connected = (deviceStatus & 0x1) == 1;
    const is_in_bootloader_mode = ((deviceStatus >> 1) & 0x1) == 1;

    return {
      connected: is_connected,
      state: is_in_bootloader_mode ? DeviceState.BOOTLOADER : DeviceState.MAIN
    };
  }

  private parseAndUpdateDeviceStatus(deviceStatus: number) {
    this.deviceState = DeviceConnection.parseDeviceStatus(deviceStatus).state;
  }

  private readonly onDataFromTxChar = (e: BleError | null, char: Characteristic | null): void => {
    if (e) {
      if (e instanceof Error && e.message.includes('Operation was cancelled')) {
        return;
      }

      logger.error("Device tx data callback error", e);
      return;
    } else if (!char?.value) {
      logger.warn('No Data was recieved yet the callback was called!');
      return;
    }

    const rawData: PoolData = {
      id: uuid.v4(),
      data: new Uint8Array(Buffer.from(char.value, 'base64')),
    };
    this.pool = [...this.pool, rawData];
  };

  private readonly onDataFromDeviceStatusChar = (e: BleError | null, char: Characteristic | null): void => {
    if (e) {
      if (e instanceof Error && e.message.includes('Operation was cancelled')) {
        return;
      }

      logger.error("Device status data callback error", e);
      return;
    } else if (!char?.value) {
      logger.warn('No Data was recieved yet the callback was called!');
      return;
    }

    const status = Buffer.from(char.value, 'base64').readUint8();
    this.parseAndUpdateDeviceStatus(status);
  };
}
