import { IFixtures } from './types';
import validData from './valid';
import invalidData from './invalidData';
import error from './error';

const fixtures: IFixtures = {
  valid: validData,
  invalidData,
  error,
};

export * from './types';
export default fixtures;
