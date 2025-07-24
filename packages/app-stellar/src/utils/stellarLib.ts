import type * as StellarSdk from 'stellar-sdk';

export type StellarLibType = typeof StellarSdk;

let stellarLibInstance: StellarLibType | undefined;

export const getStellarLib = () => {
  if (!stellarLibInstance) {
    throw new Error('stellar-sdk has not been set yet');
  }
  return stellarLibInstance;
};

export const setStellarLib = (stellarLibrary: StellarLibType) => {
  stellarLibInstance = stellarLibrary;
};