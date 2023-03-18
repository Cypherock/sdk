import { IFixtures } from './types';
import validData from './valid';
import errorData from './error';

const fixtures: IFixtures = {
  valid: validData,
  error: errorData,
};

export * from './types';
export default fixtures;
