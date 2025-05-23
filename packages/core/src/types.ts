import { DeviceState, IDeviceConnection } from '@cypherock/sdk-interfaces';
import * as rawOperations from './operations/raw';
import * as operations from './operations/proto';
import * as commands from './commands';
import { PacketVersion } from './utils';
import { RawData, StatusData } from './encoders/raw';
import {
  IAppVersionResultResponse,
  IVersion,
} from './encoders/proto/generated/types';

export interface IDeprecatedCommunication {
  isLegacyOperationSupported(): Promise<boolean>;
  isRawOperationSupported(): Promise<boolean>;
  sendLegacyCommand(
    command: number,
    data: string,
    maxTries?: number,
    timeout?: number,
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
    timeout?: number;
  }): Promise<void>;
  getCommandOutput(
    sequenceNumber: number,
    maxTries?: number,
    timeout?: number,
  ): Promise<
    import('./encoders/raw').StatusData | import('./encoders/raw').RawData
  >;
  waitForCommandOutput(params: {
    sequenceNumber: rawOperations.IWaitForCommandOutputParams['sequenceNumber'];
    expectedCommandTypes: rawOperations.IWaitForCommandOutputParams['expectedCommandTypes'];
    onStatus?: rawOperations.IWaitForCommandOutputParams['onStatus'];
    options?: rawOperations.IWaitForCommandOutputParams['options'];
  }): Promise<RawData>;
  getCommandStatus(maxTries?: number, timeout?: number): Promise<StatusData>;
  sendCommandAbort(
    sequenceNumber: number,
    maxTries?: number,
    timeout?: number,
  ): Promise<StatusData>;
}
export interface IFeatureSupport {
  name: string;
  fromVersion: string;
}
export interface ISDK {
  deprecated: IDeprecatedCommunication;
  getConnection(): IDeviceConnection;
  getVersion(): string;
  getPacketVersion(): PacketVersion | undefined;
  isSupported(): Promise<boolean>;
  getSequenceNumber(): Promise<number>;
  getNewSequenceNumber(): Promise<number>;
  beforeOperation(): Promise<void>;
  afterOperation(): Promise<void>;
  configureAppletId(appletId: number): void;
  destroy(): Promise<void>;
  isInBootloader(): Promise<boolean>;
  getDeviceState(): Promise<DeviceState>;
  sendQuery(
    data: Uint8Array,
    options?: {
      sequenceNumber: number;
      maxTries?: number;
      timeout?: number;
    },
  ): Promise<void>;
  getResult(options?: {
    sequenceNumber: number;
    maxTries?: number;
    timeout?: number;
  }): Promise<{
    isStatus: boolean;
    result: Uint8Array | import('.').Status;
  }>;
  waitForResult(params?: {
    sequenceNumber?: operations.IWaitForCommandOutputParams['sequenceNumber'];
    onStatus?: operations.IWaitForCommandOutputParams['onStatus'];
    options?: operations.IWaitForCommandOutputParams['options'];
  }): Promise<Uint8Array>;
  getStatus(
    maxTries?: number,
    timeout?: number,
    dontLog?: boolean,
  ): Promise<import('.').Status>;
  sendAbort(options?: {
    sequenceNumber?: number;
    maxTries?: number;
    timeout?: number;
  }): Promise<import('.').Status>;
  getAppVersions(
    onStatus?: commands.IGetAppVersionsParams['onStatus'],
    options?: commands.IGetAppVersionsParams['options'],
  ): Promise<IAppVersionResultResponse>;
  getAppVersion(appId: number): Promise<IVersion | undefined>;
  checkAppCompatibility(
    version: { from: string; to?: string },
    options?: commands.IGetAppVersionsParams['options'],
  ): Promise<void>;
  checkFeatureSupportCompatibility(feature: IFeatureSupport[]): Promise<void>;
  sendBootloaderAbort(options?: {
    firstTimeout?: number;
    timeout?: number;
    maxTries?: number;
  }): Promise<void>;
  sendBootloaderData(
    data: string,
    onProgress?: (progress: number) => void,
    options?: {
      firstTimeout?: number;
      timeout?: number;
      maxTries?: number;
    },
  ): Promise<void>;
  runOperation<R>(operation: () => Promise<R>): Promise<R>;
  validateNotInBootloaderMode(): Promise<void>;
  startSession(
    onStatus?: commands.IStartSessionParams['onStatus'],
    options?: commands.IStartSessionParams['options'],
  ): Promise<commands.IStartSessionResult>;
  closeSession(
    onStatus?: commands.ICloseSessionParams['onStatus'],
    options?: commands.ICloseSessionParams['options'],
  ): Promise<void>;
}
