export interface IDecryptMessagesWithPinResult {
  decryptedData: Uint8Array[];
  decryptedDataAsStrings: string[];
}

export interface IDecryptMessagesWithPinParams {
  walletId: Uint8Array;
  encryptedData: Uint8Array;
  onDecryption?: (result: IDecryptMessagesWithPinResult) => void;
}
