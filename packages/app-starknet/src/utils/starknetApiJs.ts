import type starknetApiJs from 'starknet';

export type starknetApiJsLibType = typeof starknetApiJs;

let starknetApiJsLibInstance: starknetApiJsLibType | undefined;

export const getStarknetApiJs = () => {
  if (!starknetApiJsLibInstance) {
    throw new Error('starknetApiJs has not been set yet');
  }
  return starknetApiJsLibInstance;
};

export const setStarknetApiJs = (
  starknetApiJsLibrary: starknetApiJsLibType,
) => {
  starknetApiJsLibInstance = starknetApiJsLibrary;
};
