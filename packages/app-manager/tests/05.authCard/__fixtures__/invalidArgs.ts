import { IAuthCardTestCase } from './types';

const withCardIndex0: IAuthCardTestCase = {
  name: 'With card index 0',
  params: {
    cardNumber: 0,
  },
  queries: [],
  results: [],
  errorInstance: Error,
  errorMessage: /Card number/,
};

const withCardIndex5: IAuthCardTestCase = {
  name: 'With card index 5',
  params: {
    cardNumber: 5,
  },
  queries: [],
  results: [],
  errorInstance: Error,
  errorMessage: /Card number/,
};

const withNegetiveCardIndex: IAuthCardTestCase = {
  name: 'With negetive card index',
  params: {
    cardNumber: -5,
  },
  queries: [],
  results: [],
  errorInstance: Error,
  errorMessage: /Card number/,
};

const invalidArgs: IAuthCardTestCase[] = [
  withCardIndex0,
  withCardIndex5,
  withNegetiveCardIndex,
];

export default invalidArgs;
