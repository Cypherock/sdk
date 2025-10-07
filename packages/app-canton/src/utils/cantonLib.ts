export type CantonLibType = any;

let cantonLibInstance: CantonLibType | undefined;

export const getCantonLib = () => {
  if (!cantonLibInstance) {
    throw new Error('canton lib has not been set yet');
  }
  return cantonLibInstance;
};

export const setCantonLib = (cantonLibrary: CantonLibType) => {
  cantonLibInstance = cantonLibrary;
};
