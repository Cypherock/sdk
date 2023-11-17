import { ISignEntityInfoInitiateRequest } from '../../proto/generated/types';

export type ISignEntityInfoParams = ISignEntityInfoInitiateRequest;

export interface ISignEntityInfoResult {
  signature: Uint8Array;
}
