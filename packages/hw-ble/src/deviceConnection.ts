/* eslint-disable class-methods-use-this */
import {
  IDeviceConnection,
  ConnectionTypeMap,
  DeviceState,
  PoolData,
} from '@cypherock/sdk-interfaces';
import * as ExpoDevice from 'expo-device';
import { PermissionsAndroid } from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import uuid from 'uuid';
import {
  FirmwareUpgradeState,
  Upgrade,
  UpgradeFileType,
  UpgradeMode,
} from '@playerdata/react-native-mcu-manager';
import { logger } from './logger';

const NUS_SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const NUS_RX_CHARACTERISTICS_UUID = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
const NUS_TX_CHARACTERISTICS_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

export default class DeviceConnection implements IDeviceConnection {
  private readonly bleManager: BleManager;

  private pool: PoolData[];

  private availableDevices: Device[];

  private connectedDevice: Device | null;

  private readonly deviceState: DeviceState;

  private readonly initialized: boolean;

  private sequenceNumber: number;

  constructor() {
    this.bleManager = new BleManager();
    this.pool = [];
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

  private onDataReceive(
    error: BleError | null,
    characteristic: Characteristic | null,
  ): void {
    if (error) {
      logger.error(error);
      return;
    }
    if (!characteristic?.value) {
      logger.warn('No Data was recieved');
      return;
    }

    const rawData: PoolData = {
      id: uuid.v4(),
      data: new Uint8Array(Buffer.from(characteristic.value, 'base64')),
    };
    this.pool = [...this.pool, rawData];
  }

  public async connect(device: Device) {
    try {
      await this.stopScanning();
      const deviceConnection = await this.bleManager.connectToDevice(device.id);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      this.connectedDevice = device;

      device.monitorCharacteristicForService(
        NUS_SERVICE_UUID,
        NUS_TX_CHARACTERISTICS_UUID,
        this.onDataReceive,
        undefined,
        'notification',
      );
    } catch (e) {
      logger.error('Error while connecting to the device');
      logger.error(e);
    }

    return true;
  }

  public async getDeviceState() {
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
    if (this.connectedDevice && (await this.connectedDevice.isConnected())) {
      return true;
    }

    return false;
  }

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

  // TODO(pegvin) - Check for ACK or resend the data if required.
  public async send(data: Uint8Array) {
    this.connectedDevice?.writeCharacteristicWithoutResponseForService(
      NUS_SERVICE_UUID,
      NUS_RX_CHARACTERISTICS_UUID,
      Buffer.from(data).toString('base64'),
    );
  }

  public async receive() {
    return this.pool.shift()?.data;
  }

  public async peek() {
    return [...this.pool];
  }

  public async updateFirmware(
    device: Device,
    firmwareURI: string,
    onProgress: ((progress: number) => void) | undefined,
    onStateChange: ((state: FirmwareUpgradeState) => void) | undefined,
  ): Promise<{ cancel: () => void }> {
    const upgrade = new Upgrade(
      device.id,
      firmwareURI,
      {
        estimatedSwapTime: 60,
        upgradeMode: UpgradeMode.CONFIRM_ONLY,
        upgradeFileType: UpgradeFileType.ZIP,
      },
      onProgress,
      onStateChange,
    );

    await upgrade.runUpgrade();
    upgrade.destroy();

    return {
      cancel: () => {
        upgrade.cancel();
        upgrade.destroy();
      },
    };
  }
}
