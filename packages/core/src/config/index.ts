import * as commands from './command';
import * as constants from './constants';
import * as radix from './radix';

export const v1 = {
  commands: commands.v1,
  constants: constants.v1,
  radix: radix.v1,
};

export const v2 = {
  commands: commands.v1,
  constants: constants.v2,
  radix: radix.v2,
};

export const v3 = {
  commands: commands.v3,
  constants: constants.v3,
  radix: radix.v3,
};

const config = {
  v1,
  v2,
  v3,
};

export default config;
