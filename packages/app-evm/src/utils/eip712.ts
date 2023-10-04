import type eip712 from 'eip-712';

export type eip712LibType = typeof eip712;

let eip712Instance: eip712LibType | undefined;

export const getEip712Lib = () => {
  if (!eip712Instance) {
    throw new Error('eip 712 has not been set yet');
  }
  return eip712Instance;
};

export const setEip712Lib = (ethersLibrary: eip712LibType) => {
  eip712Instance = ethersLibrary;
};
