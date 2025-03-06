import type dag4 from '@stardust-collective/dag4';

export type Dag4LibType = typeof dag4;

let dag4LibInstance: Dag4LibType | undefined;

export const getDag4Lib = () => {
  if (!dag4LibInstance) {
    throw new Error('dag4l has not been set yet');
  }
  return dag4LibInstance;
};

export const setDag4Lib = (dag4Library: Dag4LibType) => {
  dag4LibInstance = dag4Library;
};
