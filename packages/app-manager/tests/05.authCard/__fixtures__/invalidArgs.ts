import { IAuthCardTestCase } from './types';

const withCardIndex0: IAuthCardTestCase = {
  name: 'With card index 0',
  params: {
    cardIndex: 0,
  },
  queries: [],
  results: [],
  errorInstance: Error,
  errorMessage: /Card index/,
};

const withCardIndex5: IAuthCardTestCase = {
  name: 'With card index 5',
  params: {
    cardIndex: 5,
  },
  queries: [],
  results: [],
  errorInstance: Error,
  errorMessage: /Card index/,
};

const withNegetiveCardIndex: IAuthCardTestCase = {
  name: 'With negetive card index',
  params: {
    cardIndex: -5,
  },
  queries: [],
  results: [],
  errorInstance: Error,
  errorMessage: /Card index/,
};

const invalidArgs: IAuthCardTestCase[] = [
  withCardIndex0,
  withCardIndex5,
  withNegetiveCardIndex,
];

export default invalidArgs;
