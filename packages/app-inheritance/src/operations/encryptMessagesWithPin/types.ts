export enum EncryptMessagesWithPinEvent {
  INIT = 0,
  CONFIRMED = 1,
  MESSAGE_VERIFIED = 2,
  PIN_ENTERED = 3,
  MESSAGE_ENCRYPTED = 4,
}

export type EncryptMessagesWithPinEventHandler = (
  event: EncryptMessagesWithPinEvent,
) => void;

export interface InheritanceMessage {
  value: string;
  verifyOnDevice?: boolean;
}

export interface IEncryptMessagesWithPinParams {
  walletId: Uint8Array;
  messages: InheritanceMessage[];
  onEvent?: EncryptMessagesWithPinEventHandler;
}

export interface IEncryptMessagesWithPinResult {
  encryptedPacket: Uint8Array;
}
