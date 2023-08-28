import type nearApiJs from 'near-api-js';

export type nearApiJsLibType = typeof nearApiJs;

let nearApiJsLibInstance: nearApiJsLibType | undefined;

export const getNearApiJs = () => {
  if (!nearApiJsLibInstance) {
    throw new Error('nearApiJs has not been set yet');
  }
  return nearApiJsLibInstance;
};

export const setNearApiJs = (nearApiJsLibrary: nearApiJsLibType) => {
  nearApiJsLibInstance = nearApiJsLibrary;
};
