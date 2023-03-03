export enum CmdState {
  CMD_STATE_NONE = 0,
  CMD_STATE_RECEIVING = 1,
  CMD_STATE_RECEIVED = 2,
  CMD_STATE_EXECUTING = 3,
  CMD_STATE_DONE = 4,
  CMD_STATE_FAILED = 5,
  CMD_STATE_INVALID_CMD = 6,
}

export enum DeviceWaitOn {
  IDLE = 1,
  BUSY_IP_CARD = 2,
  BUSY_IP_KEY = 3,
}

export enum DeviceIdleState {
  IDLE = 1,
  USB = 2,
  DEVICE = 3,
}

export interface StatusData {
  deviceState: string;
  deviceWaitingOn: DeviceWaitOn;
  deviceIdleState: DeviceIdleState;
  abortDisabled: boolean;
  currentCmdSeq: number;
  cmdState: CmdState;
  flowStatus: number;
  isStatus?: boolean;
  isRawData?: boolean;
}

export interface RawData {
  commandType: number;
  data: string;
  isStatus?: boolean;
  isRawData?: boolean;
}
