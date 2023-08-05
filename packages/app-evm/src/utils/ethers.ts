import type { ethers } from 'ethers';

export type ethersLibType = typeof ethers;

let ethersLibInstance: ethersLibType | undefined;

export const getEthersLib = () => {
  if (!ethersLibInstance) {
    throw new Error('ethers has not been set yet');
  }
  return ethersLibInstance;
};

export const setEthersLib = (ethersLibrary: ethersLibType) => {
  ethersLibInstance = ethersLibrary;
};
