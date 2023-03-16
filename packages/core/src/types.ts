import { DeviceState, IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as rawOperations from './operations/raw';
import * as operations from './operations/proto';
import { PacketVersion } from './utils';
import { RawData, StatusData } from './encoders/raw';

export interface IDeprecatedCommunication {
  isLegacyOperationSupported(): boolean;
  isRawOperationSupported(): boolean;
  sendLegacyCommand(
    command: number,
    data: string,
    maxTries?: number,
  ): Promise<void>;
  receiveLegacyCommand(
    commands: number[],
    timeout?: number,
  ): Promise<{
    commandType: number;
    data: string;
  }>;
  sendCommand(params: {
    commandType: number;
    data: string;
    sequenceNumber: number;
    maxTries?: number;
  }): Promise<void>;
  getCommandOutput(
    sequenceNumber: number,
    maxTries?: number,
  ): Promise<
    import('./encoders/raw').StatusData | import('./encoders/raw').RawData
  >;
  waitForCommandOutput(params: {
    sequenceNumber: rawOperations.IWaitForCommandOutputParams['sequenceNumber'];
    expectedCommandTypes: rawOperations.IWaitForCommandOutputParams['expectedCommandTypes'];
    onStatus?: rawOperations.IWaitForCommandOutputParams['onStatus'];
    maxTries?: rawOperations.IWaitForCommandOutputParams['maxTries'];
    options?: rawOperations.IWaitForCommandOutputParams['options'];
  }): Promise<RawData>;
  getCommandStatus(maxTries?: number): Promise<StatusData>;
  sendCommandAbort(
    sequenceNumber: number,
    maxTries?: number,
  ): Promise<StatusData>;
}

export interface ISDK {
  deprecated: IDeprecatedCommunication;
  getConnection(): IDeviceConnection;
  getVersion(): string;
  getPacketVersion(): PacketVersion | undefined;
  isSupported(): boolean;
  getSequenceNumber(): number;
  getNewSequenceNumber(): number;
  beforeOperation(): Promise<void>;
  afterOperation(): Promise<void>;
  configureAppletId(appletId: number): void;
  destroy(): Promise<void>;
  isInBootloader(): boolean;
  getDeviceState(): DeviceState;
  sendQuery(params: {
    data: Uint8Array;
    sequenceNumber: number;
    maxTries?: number;
  }): Promise<void>;
  getResult(
    sequenceNumber: number,
    maxTries?: number,
  ): Promise<{
    isStatus: boolean;
    result: Uint8Array | import('.').Status;
  }>;
  waitForResult(params: {
    sequenceNumber: operations.IWaitForCommandOutputParams['sequenceNumber'];
    onStatus?: operations.IWaitForCommandOutputParams['onStatus'];
    maxTries?: operations.IWaitForCommandOutputParams['maxTries'];
    options?: operations.IWaitForCommandOutputParams['options'];
  }): Promise<Uint8Array>;
  getStatus(maxTries?: number): Promise<import('.').Status>;
  sendAbort(
    sequenceNumber: number,
    maxTries?: number,
  ): Promise<import('.').Status>;
  sendBootloaderAbort(
    maxTries?: number,
    options?: {
      firstTimeout?: number;
      timeout?: number;
    },
  ): Promise<void>;
  sendBootloaderData(
    data: string,
    onProgress?: (progress: number) => void,
    maxTries?: number,
    options?: {
      firstTimeout?: number;
      timeout?: number;
    },
  ): Promise<void>;
  runOperation<R>(operation: () => Promise<R>): Promise<R>;
  validateNotInBootloaderMode(): void;
}
