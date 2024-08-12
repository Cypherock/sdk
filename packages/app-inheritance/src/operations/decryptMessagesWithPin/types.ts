export interface IDecryptMessagesWithPinParams {
  encryptedData: Uint8Array;
}

export interface IDecryptMessagesWithPinResult {
  decryptedData: Uint8Array[];
  decryptedDataAsStrings: string[];
}
