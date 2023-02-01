// eslint-disable-next-line
export class DataListener {
  private connection: USBDevice;

  private listening: boolean;

  private readonly interfaceNumber: number;

  private readonly endpointIn: number;

  private readonly endpointOut: number;

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
  }

  public static async create(connection: USBDevice) {
    let interfaceNumber = 0;
    let endpointIn = 0;
    let endpointOut = 0;

    console.log('Starting device connection');
    await connection.open();

    if (connection.configuration === null) {
      await connection.selectConfiguration(1);
    }

    if (!connection.configuration) {
      throw new Error('Failed to configure device');
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

    console.log('Controlling transfer out');
    await connection.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: interfaceNumber
    });

    return new DataListener({
      connection,
      interfaceNumber,
      endpointIn,
      endpointOut
    });
  }

  public isListening() {
    return this.listening;
  }

  public async receive() {
    const meta = await this.connection.transferIn(this.endpointIn, 6 * 1024);
    if (!meta.data) return undefined;
    return new Uint8Array(meta.data.buffer);
  }

  public async send(data: Uint8Array) {
    await this.connection.transferOut(this.endpointOut, data);
  }

  // eslint-disable-next-line
  public peek() {
    return [];
  }
}
