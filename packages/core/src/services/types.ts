export interface IInitiateServerSessionParams {
  deviceRandomPublic: Uint8Array;
  deviceId: Uint8Array;
  signature: Uint8Array;
  postfix1: Uint8Array;
  postfix2: Uint8Array;
}

export interface IInitiateServerSessionResult {
  serverRandomPublic?: string;
  sessionAge?: number;
  signature?: string;
  sessionId?: string;
  deviceId?: string;
}
