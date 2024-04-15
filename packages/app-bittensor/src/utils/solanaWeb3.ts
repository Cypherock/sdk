import type bittensorWeb3 from '@bittensor/web3.js';

export type bittensorWeb3LibType = typeof bittensorWeb3;

let bittensorWeb3LibInstance: bittensorWeb3LibType | undefined;

export const getBittensorWeb3 = () => {
  if (!bittensorWeb3LibInstance) {
    throw new Error('bittensorWeb3 has not been set yet');
  }
  return bittensorWeb3LibInstance;
};

export const setBittensorWeb3 = (bittensorWeb3Library: bittensorWeb3LibType) => {
  bittensorWeb3LibInstance = bittensorWeb3Library;
};
