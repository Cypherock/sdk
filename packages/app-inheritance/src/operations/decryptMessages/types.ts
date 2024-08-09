export interface IDecryptMessagesParams {
  encryptedData: Uint8Array;
  getRawData?: boolean;
}

export interface IDecryptMessagesResult {
  decryptedData: (string | Uint8Array)[];
}
