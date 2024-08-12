export interface InheritanceMessage {
  value: string;
  isPrivate?: boolean;
}

export interface IEncryptMessagesWithPinParams {
  walletId: Uint8Array;
  messages: InheritanceMessage[];
}

export interface IEncryptMessagesWithPinResult {
  encryptedPacket: Uint8Array;
}
