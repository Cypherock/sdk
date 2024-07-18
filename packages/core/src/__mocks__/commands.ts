import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { jest } from '@jest/globals';
import { Status } from '../encoders/types';
import { PacketVersion } from '../utils';

type SendCommandType = (params: {
  connection: IDeviceConnection;
  rawData?: string;
  protoData?: string;
  version: PacketVersion;
  sequenceNumber: number;
  maxTries?: number;
  timeout?: number;
}) => Promise<void>;

type WaitForResultType = (params: {
  connection: IDeviceConnection;
  sequenceNumber: number;
  appletId: number;
  onStatus?: (status: Status) => void;
  version: PacketVersion;
  options?: { interval?: number; timeout?: number; maxTries?: number };
  allowCoreData?: boolean;
}) => Promise<Uint8Array>;

export const sendCommand: jest.Mock<SendCommandType> =
  jest.fn<SendCommandType>();

export const waitForResult: jest.Mock<WaitForResultType> =
  jest.fn<WaitForResultType>();

jest.mock('../operations/helpers/sendCommand', () => {
  const originalModule: any = jest.requireActual(
    '../operations/helpers/sendCommand',
  );

  return {
    __esModule: true,
    ...originalModule,
    sendCommand,
  };
});

jest.mock('../operations/proto/waitForResult', () => {
  const originalModule: any = jest.requireActual(
    '../operations/proto/waitForResult',
  );

  return {
    __esModule: true,
    ...originalModule,
    waitForResult,
  };
});
