export enum CmdState {
  CMD_STATE_NONE = 0,
  CMD_STATE_RECEIVING = 1,
  CMD_STATE_RECEIVED = 2,
  CMD_STATE_EXECUTING = 3,
  CMD_STATE_DONE = 4,
  CMD_STATE_FAILED = 5,
  CMD_STATE_INVALID_CMD = 6
}

export enum DeviceWaitOn {
  NULL = 0,
  IDLE = 1,
  BUSY_IP_CARD = 2,
  BUSY_IP_KEY = 3
}

export enum DeviceIdleState {
  NULL = 0,
  IDLE = 1,
  USB = 2,
  DEVICE = 3
}

export interface IStatusData {
  deviceWaitingOn: DeviceWaitOn;
  deviceIdleState: DeviceIdleState;
  abortDisabled: boolean;
  currentCmdSeq: number;
  cmdState: CmdState;
  flowStatus: number;
  isStatus?: boolean;
  isRawData?: boolean;
}

export interface IRawData {
  commandType: number;
  data: string;
  isStatus?: boolean;
  isRawData?: boolean;
}

export interface ISendCommandParams {
  commandType: number;
  data: string;
  sequenceNumber: number;
  maxTries?: number;
}

export interface ISdk {
  getVersion: () => string;
  isSupported: () => boolean;
  isSDKNewer: () => boolean;
  sendLegacyCommand: (command: number, data: string) => Promise<void>;
  receiveLegacyCommand: (
    commands: number[],
    timeout?: number
  ) => Promise<{ commandType: number; data: string }>;
  getSequenceNumber: () => number;
  getNewSequenceNumber: () => number;
  sendCommand: (params: ISendCommandParams) => Promise<void>;
  getCommandOutput: (sequenceNumber: number) => Promise<IRawData | IStatusData>;
}
