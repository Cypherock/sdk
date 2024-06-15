let tronWebInstance: any | undefined;

export const getTronWeb = () => {
  if (!tronWebInstance) {
    throw new Error('tronweb has not been set yet');
  }
  return tronWebInstance;
};

export const setTronWeb = (tronWeb: any) => {
  tronWebInstance = tronWeb;
};
