import type xrpl from 'xrpl';

export type XrpLibType = typeof xrpl;

let xrpLibInstance: XrpLibType | undefined;

export const getXrpLib = () => {
  if (!xrpLibInstance) {
    throw new Error('xrpl has not been set yet');
  }
  return xrpLibInstance;
};

export const setXrpLib = (xrpLibrary: XrpLibType) => {
  xrpLibInstance = xrpLibrary;
};
