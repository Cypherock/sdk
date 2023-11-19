import { IGetPublicKeyInitiateRequest } from '../../proto/generated/types';

export type IGetPublicKeyParams = IGetPublicKeyInitiateRequest;

export interface IGetPublicKeyResult {
  pubKey: Uint8Array;
}
