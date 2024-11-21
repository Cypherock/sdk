export interface IInitiateServerSessionParams {
  deviceRandomPublic: Uint8Array;
  deviceId: Uint8Array;
  signature: Uint8Array;
  postfix1: Uint8Array;
  postfix2: Uint8Array;
  keyIndex: number;
}

export interface IInitiateServerSessionResult {
  publicKey?: string;
  sessionAge?: number;
  signature?: string;
  sessionId?: string;
}
