import { IFixtures } from './types';
import valid from './valid';
import invalidData from './invalidData';
import error from './error';

const fixtures: IFixtures = {
  valid,
  invalidData,
  error,
};

export * from './types';
export default fixtures;
