export enum DecryptMessagesWithPinEvent {
  INIT = 0,
  CONFIRMED = 1,
  MESSAGE_DECRYPTIED = 2,
  PIN_VERIFIED = 3,
}

export type DecryptMessagesWithPinEventHandler = (
  event: DecryptMessagesWithPinEvent,
) => void;
export interface IDecryptMessagesWithPinResult {
  decryptedData: Uint8Array[];
  decryptedDataAsStrings: string[];
}

export interface IDecryptMessagesWithPinParams {
  walletId: Uint8Array;
  encryptedData: Uint8Array;
  onEvent?: DecryptMessagesWithPinEventHandler;
}
