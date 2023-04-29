import { IFixtures } from './types';
import invalidData from './invalidData';
import valid from './valid';
import error from './error';
import invalidArgs from './invalidArgs';

const fixtures: IFixtures = {
  valid,
  invalidData,
  error,
  invalidArgs,
};

export * from './types';
export default fixtures;
