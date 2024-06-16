import { IFeatureSupport } from '@cypherock/sdk-core';

export const chainToAppIdMap: Record<number, number | undefined> = {
  // ETH
  1: 0x07,
  // Polygon
  137: 0x09,
  // BSC
  56: 0x0b,
  // Fantom
  250: 0x0c,
  // Avalanche
  43114: 0x0d,
  // Optimism
  10: 0x0e,
  // Arbitrum
  42161: 0x11,
  // Base
  8453: 0x12,
};

export const APP_VERSION = {
  from: '1.0.0',
  to: '2.0.0',
};

export type SupportedFeature = 'EIP_1559';

export const AppFeatures: Record<SupportedFeature, IFeatureSupport> = {
  EIP_1559: {
    name: 'EIP1559',
    fromVersion: '1.1.0',
  },
};
