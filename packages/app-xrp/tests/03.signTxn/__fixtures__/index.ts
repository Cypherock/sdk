import { IFixtures } from './types';
import error from './error';
import invalidData from './invalidData';
import invalidArgs from './invalidArgs';
import valid from './valid';

const fixtures: IFixtures = {
  valid,
  invalidArgs,
  error,
  invalidData,
};

export default fixtures;
