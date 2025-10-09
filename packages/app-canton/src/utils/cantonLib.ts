import type cantonWalletSdk from '@canton-network/wallet-sdk';
import type cantonLedgerProto from '@canton-network/core-ledger-proto';

export interface CantonLib {
  CantonWalletSdk: typeof cantonWalletSdk;
  CantonCoreLedgerProto: typeof cantonLedgerProto;
}

let cantonLibInstance: CantonLib | undefined;

export const getCantonLib = () => {
  if (!cantonLibInstance) {
    throw new Error('canton lib has not been set yet');
  }
  return cantonLibInstance;
};

export const setCantonLib = (cantonLibrary: CantonLib) => {
  cantonLibInstance = cantonLibrary;
};
