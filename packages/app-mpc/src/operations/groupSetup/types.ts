import {
  GroupKeyInfo,
  SignedShareData,
  SignedPublicKey,
} from '../../proto/generated/mpc_poc/common';
import { IEntityInfo } from '../../types';

export type PublicKeyHandler = (pubKey: Uint8Array) => void;
export type EntityInfoHandler = (
  entityInfo: IEntityInfo,
) => Promise<{ fingerprint: Uint8Array; entityInfo: IEntityInfo }[]>;
export type VerificationHandler = (verification: boolean) => void;
export type GroupIDHandler = (
  groupId: Uint8Array,
  signature: Uint8Array,
) => Promise<void>;
export type ShareDataHandler = (
  shareData: SignedShareData,
) => Promise<SignedShareData[]>;
export type IndividualPublicKeyHandler = (
  individualPublicKey: SignedPublicKey,
) => Promise<SignedPublicKey[]>;

export interface IGroupSetupParams {
  walletId: Uint8Array;
  threshold: number;
  totalParticipants: number;
  onPublicKey?: PublicKeyHandler;
  onEntityInfo: EntityInfoHandler;
  onVerification?: VerificationHandler;
  onGroupID?: GroupIDHandler;
  onShareData?: ShareDataHandler;
  onIndividualPublicKey?: IndividualPublicKeyHandler;
}

export interface IGroupSetupResult {
  groupKeyInfo: GroupKeyInfo;
  signature: Uint8Array;
  completed: boolean;
}
