import { IInitApplicationInitiateRequest } from '../../proto/generated/types';

export type IInitApplicationParams = IInitApplicationInitiateRequest;

export interface IInitApplicationResult {
  initiated: boolean;
  pubKey: Uint8Array;
}
