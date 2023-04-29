import {
  DeviceConnectionError,
  DeviceConnectionErrorType,
  PoolData,
} from '@cypherock/sdk-interfaces';
import * as uuid from 'uuid';

// eslint-disable-next-line
export class DataListener {
  private readonly connection: USBDevice;

  private readonly listening: boolean;

  private readonly interfaceNumber: number;

  private readonly endpointIn: number;

  private readonly endpointOut: number;

  private readonly pool: PoolData[];

  private constructor(params: {
    connection: USBDevice;
    interfaceNumber: number;
    endpointIn: number;
    endpointOut: number;
  }) {
    this.connection = params.connection;
    this.interfaceNumber = params.interfaceNumber;
    this.endpointIn = params.endpointIn;
    this.endpointOut = params.endpointOut;

    this.listening = true;
    this.pool = [];
  }

  public static async create(connection: USBDevice) {
    let interfaceNumber = 0;
    let endpointIn = 0;
    let endpointOut = 0;

    await connection.open();

    if (!connection.configuration) {
      await connection.selectConfiguration(1);
    }

    if (!connection.configuration) {
      throw new DeviceConnectionError(
        DeviceConnectionErrorType.FAILED_TO_CONNECT,
      );
    }

    const { interfaces } = connection.configuration;
    interfaces.forEach(element => {
      element.alternates.forEach(elementalt => {
        if (elementalt.interfaceClass === 0xff) {
          interfaceNumber = element.interfaceNumber;
          elementalt.endpoints.forEach(elementendpoint => {
            if (elementendpoint.direction === 'out') {
              endpointOut = elementendpoint.endpointNumber;
            }
            if (elementendpoint.direction === 'in') {
              endpointIn = elementendpoint.endpointNumber;
            }
          });
        }
      });
    });

    await connection.claimInterface(interfaceNumber);
    await connection.selectAlternateInterface(interfaceNumber, 0);

    await connection.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: interfaceNumber,
    });

    return new DataListener({
      connection,
      interfaceNumber,
      endpointIn,
      endpointOut,
    });
  }

  public isListening() {
    return this.listening;
  }

  public async receive() {
    const existingData = this.pool.shift();
    if (existingData) return existingData.data;

    return this.receiveNew();
  }

  public async send(data: Uint8Array) {
    await this.connection.transferOut(this.endpointOut, data);
  }

  // eslint-disable-next-line
  public async peek() {
    const newData = await this.receiveNew();

    if (newData) {
      this.pool.push({ id: uuid.v4(), data: newData });
    }

    return [...this.pool];
  }

  private async receiveNew() {
    const meta = await this.connection.transferIn(this.endpointIn, 6 * 1024);
    if (!meta.data || meta.data.byteLength === 0) return undefined;
    return new Uint8Array(meta.data.buffer);
  }
}
