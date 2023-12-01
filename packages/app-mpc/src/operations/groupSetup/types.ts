import { IEntityInfo } from '../../types';

export type PublicKeyHandler = (pubKey: Uint8Array) => void;
export type EntityInfoHandler = (
  entityInfo: IEntityInfo,
) => Promise<{ fingerprint: Uint8Array; entityInfo: IEntityInfo }[]>;
export type VerificationHandler = (verification: boolean) => void;

export interface IGroupSetupParams {
  walletId: Uint8Array;
  threshold: number;
  totalParticipants: number;
  onPublicKey?: PublicKeyHandler;
  onEntityInfo: EntityInfoHandler;
  onVerification?: VerificationHandler;
}

export interface IGroupSetupResult {
  groupId: Uint8Array;
  signature: Uint8Array;
}
