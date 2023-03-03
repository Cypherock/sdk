import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { instantiate, Core } from './generated/core';

const isNode =
  typeof process !== 'undefined' && process.versions && process.versions.node;

let _fs: any;
let _path: any;
const fsModule = 'fs/promises';
const pathModule = 'path';

export interface IWASMOptions {
  folder?: string;
  url?: string;
}

const createCompileCore = (params?: IWASMOptions) => {
  if (!isNode && !params?.url) {
    throw new Error('Please provide a WASM folder or URL');
  }

  return async (name: string) => {
    if (params?.url) {
      return fetch(`${params?.url}/${name}`).then(WebAssembly.compileStreaming);
    }

    _fs = _fs || (await import(fsModule));
    _path = _path || (await import(pathModule));

    if (params?.folder) {
      return WebAssembly.compile(
        await _fs.readFile(_path.join(params.folder, name)),
      );
    }

    return WebAssembly.compile(
      await _fs.readFile(_path.join(__dirname, '..', 'wasm', name)),
    );
  };
};

export default class SDK {
  private wasm: typeof Core;

  private connection: IDeviceConnection;

  private constructor(connection: IDeviceConnection, wasm: typeof Core) {
    this.wasm = wasm;
    this.connection = connection;
  }

  public static async create(
    connection: IDeviceConnection,
    params?: IWASMOptions,
  ) {
    const wasm = await instantiate(createCompileCore(params), {
      connection,
    });
    return new SDK(connection, wasm);
  }

  public getNewSequenceNumber() {
    return this.connection.getNewSequenceNumber();
  }

  public getSequenceNumber() {
    return this.connection.getSequenceNumber();
  }

  public run() {
    this.wasm.run();
  }
}
