import { IGroupKeyInfo } from '../../types';

export interface IGetChildKeyParams {
  walletId: Uint8Array;
  groupKeyInfo: IGroupKeyInfo;
  signature: Uint8Array;
  path: number[];
}

export interface IGetChildKeyResult {
  pubKey: Uint8Array;
}
