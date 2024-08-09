export const WALLET_ID_LENGTH = 32;

export interface Message {
  value: string;
  isPrivate?: boolean;
}

export interface IEncryptMessagesParams {
  walletId: Uint8Array;
  messages: Message[];
}

export interface IEncryptMessagesResult {
  encryptedPacket: Uint8Array;
}
