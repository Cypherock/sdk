export interface InheritanceMessage {
  value: string;
  verifyOnDevice?: boolean;
}

export interface IEncryptMessagesWithPinParams {
  walletId: Uint8Array;
  messages: InheritanceMessage[];
}

export interface IEncryptMessagesWithPinResult {
  encryptedPacket: Uint8Array;
}
