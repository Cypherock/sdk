export enum DecryptMessagesWithPinEvent {
  INIT = 0,
  CONFIRMED = 1,
  MESSAGE_DECRYPTED_CARD_TAP = 2,
  PIN_VERIFIED = 3,
}

export type DecryptMessagesWithPinEventHandler = (
  event: DecryptMessagesWithPinEvent,
) => void;

export interface IDecryptMessagesWithPinResultValue {
  data: Uint8Array;
  dataAsString: string;
}

export type IDecryptMessagesWithPinResult = Record<
  number,
  IDecryptMessagesWithPinResultValue
>;

export interface IDecryptMessagesWithPinParams {
  walletId: Uint8Array;
  encryptedData: Uint8Array;
  onEvent?: DecryptMessagesWithPinEventHandler;
}
