import { IInitApplicationInitiateRequest } from '../../proto/generated/types';

export type IInitApplicationParams = IInitApplicationInitiateRequest;

export interface IInitApplicationResult {
  pubKey: Uint8Array;
}
