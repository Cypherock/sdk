import { IFixtures } from './types';
import invalidData from './invalidData';
import valid from './valid';
import error from './error';

const fixtures: IFixtures = {
  valid,
  invalidData,
  error,
};

export * from './types';
export default fixtures;
