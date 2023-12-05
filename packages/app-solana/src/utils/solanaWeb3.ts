import type solanaWeb3 from '@solana/web3.js';

export type solanaWeb3LibType = typeof solanaWeb3;

let solanaWeb3LibInstance: solanaWeb3LibType | undefined;

export const getSolanaWeb3 = () => {
  if (!solanaWeb3LibInstance) {
    throw new Error('solanaWeb3 has not been set yet');
  }
  return solanaWeb3LibInstance;
};

export const setSolanaWeb3 = (solanaWeb3Library: solanaWeb3LibType) => {
  solanaWeb3LibInstance = solanaWeb3Library;
};
